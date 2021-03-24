/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { EventEmitter } from "events";
import { getContainer, IGetContainerService } from "@fluid-experimental/get-container";
import { Container } from "@fluidframework/container-loader";
import { IChannelFactory } from "@fluidframework/datastore-definitions";
import { NamedFluidDataStoreRegistryEntry } from "@fluidframework/runtime-definitions";
import {
    DOProviderContainerRuntimeFactory,
    FluidDataType,
    IdToDataObjectCollection,
    IFluidStaticDataObjectClass,
    RootDataObject,
    FluidObject,
} from "./containerCode";
import {
    isIChannelFactoryCreator,
    isIFluidStaticDataObjectClass,
} from "./utils";

export interface ContainerConfig {
    dataTypes: FluidDataType[];
}

export interface ContainerCreateConfig extends ContainerConfig {
    /**
     * initialDataObjects defines dataObjects that will be created when the Container
     * is first created. It uses the key as the id and the value and the DataObject to create.
     *
     * In the example below two DataObjects will be created when the Container is first
     * created. One with id "foo1" that will return a `Foo` DataObject and the other with
     * id "bar2" that will return a `Bar` DataObject.
     *
     * ```
     * {
     *   ["foo1"]: Foo,
     *   ["bar2"]: Bar,
     * }
     * ```
     *
     * To get these DataObjects, call `container.getDataObject` passing in one of the ids.
     */
    initialObjects?: IdToDataObjectCollection;
}

export class FluidContainer extends EventEmitter implements Pick<Container, "audience" | "clientId"> {
    private readonly types: Set<string>;

    private readonly container: Container;

    public readonly audience: Container["audience"];

    public constructor(
        container: Container, // we anticipate using this later, e.g. for Audience
        namedRegistryEntries: NamedFluidDataStoreRegistryEntry[],
        private readonly rootDataObject: RootDataObject,
        public readonly createNew: boolean) {
            super();
            this.types = new Set();
            namedRegistryEntries.forEach((value: NamedFluidDataStoreRegistryEntry) => {
                const type = value[0];
                if (this.types.has(type)) {
                    throw new Error(`Multiple DataObjects share the same type identifier ${value}`);
                }
                this.types.add(type);
            });
            this.audience = container.audience;
            this.container = container;
            container.on("connected", (id: string) =>  this.emit("connected", id));
        }

    public get clientId() {
        return this.container.clientId;
    }

    public async create<T extends FluidObject>(
        dataObjectClass: IFluidStaticDataObjectClass,
        id: string,
    ) {
        const type = dataObjectClass.factory.type;
        // This is a runtime check to ensure the developer doesn't try to create something they have not defined.
        if (!this.types.has(type)) {
            throw new Error(
                `Trying to create a DataObject with type ${type} that was not defined in Container initialization`);
        }

        return this.rootDataObject.create<T>(dataObjectClass, id);
    }

    public async get<T extends FluidObject>(id: string) {
        return this.rootDataObject.get<T>(id);
    }
}

/**
 * FluidInstance provides the ability to have a Fluid object with a specific backing server outside of the
 * global context.
 */
export class FluidInstance {
    private readonly containerService: IGetContainerService;

    public constructor(getContainerService: IGetContainerService) {
        // This check is for non-typescript usages
        if (getContainerService === undefined) {
            throw new Error("Fluid cannot be initialized without a ContainerService");
        }

        this.containerService = getContainerService;
    }

    public async createContainer(id: string, config: ContainerCreateConfig): Promise<FluidContainer> {
        const [dataObjects, sharedObjects] = this.parseDataObjectsFromSharedObjects(config);
        const registryEntries = this.getRegistryEntries(dataObjects);
        const container = await getContainer(
            this.containerService,
            id,
            new DOProviderContainerRuntimeFactory(registryEntries, sharedObjects, config.initialObjects),
            true, /* createNew */
        );
        const rootDataObject = (await container.request({ url: "/" })).value;
        return new FluidContainer(container, registryEntries, rootDataObject, true /* createNew */);
    }

    public async getContainer(id: string, config: ContainerConfig): Promise<FluidContainer> {
        const [dataObjects, sharedObjects] = this.parseDataObjectsFromSharedObjects(config);
        const registryEntries = this.getRegistryEntries(dataObjects);
        const container = await getContainer(
            this.containerService,
            id,
            new DOProviderContainerRuntimeFactory(registryEntries, sharedObjects),
            false, /* createNew */
        );
        const rootDataObject = (await container.request({ url: "/" })).value;
        return new FluidContainer(container, registryEntries, rootDataObject, false /* createNew */);
    }

    private getRegistryEntries(dataObjects: IFluidStaticDataObjectClass[]) {
        const dataObjectClassToRegistryEntry = (
            dataObjectClass: IFluidStaticDataObjectClass): NamedFluidDataStoreRegistryEntry =>
            [dataObjectClass.factory.type, Promise.resolve(dataObjectClass.factory)];

        return dataObjects.map(dataObjectClassToRegistryEntry);
    }

    private parseDataObjectsFromSharedObjects(config: ContainerConfig): [IFluidStaticDataObjectClass[], IChannelFactory[]] {
        const dataObjects: IFluidStaticDataObjectClass[] = [];
        const sharedObjects: IChannelFactory[] = [];
        for (const obj of config.dataTypes) {
            if(isIChannelFactoryCreator(obj)){
                sharedObjects.push(obj.getFactory());
            } else if (isIFluidStaticDataObjectClass(obj)) {
                dataObjects.push(obj);
            } else {
                throw new Error(`Entry is neither a DataObject or a SharedObject`);
            }
        }

        if (dataObjects.length === 0 && sharedObjects.length === 0) {
            throw new Error("Container cannot be initialized without any DataTypes");
        }

        return [dataObjects, sharedObjects]
    }


}

/**
 * Singular global instance that lets the developer define the Fluid server across all instances of Containers.
 */
let globalFluid: FluidInstance | undefined;
export const Fluid = {
    init(getContainerService: IGetContainerService) {
        if (globalFluid) {
            throw new Error("Fluid cannot be initialized more than once");
        }
        globalFluid = new FluidInstance(getContainerService);
    },
    async createContainer(
        id: string, config: ContainerCreateConfig): Promise<FluidContainer> {
        if (!globalFluid) {
            throw new Error("Fluid has not been properly initialized before attempting to create a container");
        }
        return globalFluid.createContainer(id, config);
    },
    async getContainer(
        id: string, config: ContainerConfig): Promise<FluidContainer> {
        if (!globalFluid) {
            throw new Error("Fluid has not been properly initialized before attempting to get a container");
        }
        return globalFluid.getContainer(id, config);
    },
};
