/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    BaseContainerRuntimeFactory,
    DataObject,
    DataObjectFactory,
    defaultRouteRequestHandler,
} from "@fluidframework/aqueduct";
import { IContainerRuntime } from "@fluidframework/container-runtime-definitions";
import { IFluidHandle, IFluidLoadable } from "@fluidframework/core-interfaces";
import { IChannelFactory } from "@fluidframework/datastore-definitions";
import { IFluidDataStoreFactory, NamedFluidDataStoreRegistryEntry } from "@fluidframework/runtime-definitions";
import { requestFluidObject } from "@fluidframework/runtime-utils";
import { SharedObject } from "@fluidframework/shared-object-base";

import { v4 as uuid } from "uuid";

import { isIChannelFactoryCreator, isIFluidStaticDataObjectClass } from "./utils";

export type IdToDataObjectCollection = Record<string, IFluidStaticDataObjectClass>;

export type FluidDataType = IFluidStaticDataObjectClass | IChannelFactory;

export type FluidObject = DataObject | SharedObject;

export interface IFluidStaticDataObjectClass {
    readonly factory: IFluidDataStoreFactory;
}

export class RootDataObject extends DataObject {
    private dataObjectDirKey = "data-objects";
    private sharedObjectDirKey = "shared-objects";
    private get dataObjectDir() {
        const dir = this.root.getSubDirectory(this.dataObjectDirKey);
        if (dir === undefined) {
            throw new Error("DataObject sub-directory was not initialized")
        }
        return dir;
    }

    private get sharedObjectDir() {
        const dir = this.root.getSubDirectory(this.sharedObjectDirKey);
        if (dir === undefined) {
            throw new Error("SharedObject sub-directory was not initialized")
        }
        return dir;
    }

    protected async initializingFirstTime() {
        this.root.createSubDirectory(this.dataObjectDirKey);
        this.root.createSubDirectory(this.sharedObjectDirKey);
    }

    protected async hasInitialized() { }

    public async create<T extends FluidObject>(type: FluidDataType, id: string): Promise<T> {
        if (isIFluidStaticDataObjectClass(type)) {
            // Create a DataObject
            return this.createDataObject<T>(type,id);
        } else if (isIChannelFactoryCreator(type)) {
            // Create a SharedObject if that's the factory type
            return this.createSharedObject(type.getFactory(), id) as T;
        }

        throw new Error("Could not create new FluidObject because it is not of a know type");
    }

    public async get<T extends FluidObject>(id: string): Promise<T> {
        if (this.dataObjectDir.has(id)) {
            return this.getDataObject<T>(id);
        } else if (this.sharedObjectDir.has(id)) {
            return this.getSharedObject<T>(id);
        }

        // Maybe just return undefined here?
        throw new Error(`Could not get FluidObject with id:[${id}] because it does not exist`);
    }

    private async createDataObject<T extends IFluidLoadable>(
        dataObjectClass: IFluidStaticDataObjectClass,
        id: string,
    ): Promise<T> {
        const factory = dataObjectClass.factory;
        const packagePath = [...this.context.packagePath, factory.type];
        const router = await this.context.containerRuntime.createDataStore(packagePath);
        const object = await requestFluidObject<T>(router, "/");
        this.dataObjectDir.set(id, object.handle);
        return object;
    }

    private async getDataObject<T extends IFluidLoadable>(id: string) {
        const handle = await this.dataObjectDir.wait<IFluidHandle<T>>(id);
        return handle.get();
    }

    private createSharedObject<T extends SharedObject>(
        factory: IChannelFactory,
        id: string,
    ): T {
        // uuid is a throw away but currently enforced on the API
        const obj = factory.create(this.runtime, uuid()) as T;
        this.sharedObjectDir.set(id, obj.handle);
        return obj;
    }

    private async getSharedObject<T extends IFluidLoadable>(id: string) {
        const handle = await this.sharedObjectDir.wait<IFluidHandle<T>>(id);
        return handle.get();
    }
}

const rootDataStoreId = "rootDOId";
/**
 * The DOProviderContainerRuntimeFactory is the container code for our scenario.
 *
 * By including the createRequestHandler, we can create any droplet types we include in the registry on-demand.
 * These can then be retrieved via container.request("/dataObjectId").
 */
export class DOProviderContainerRuntimeFactory extends BaseContainerRuntimeFactory {
    private readonly rootDataObjectFactory; // type is DataObjectFactory
    private readonly initialDataObjects: IdToDataObjectCollection;
    constructor(
        registryEntries: NamedFluidDataStoreRegistryEntry[],
        sharedObjects: IChannelFactory[],
        initialDataObjects: IdToDataObjectCollection = {},
    ) {
        const rootDataObjectFactory = new DataObjectFactory(
            "rootDO",
            RootDataObject,
            sharedObjects,
            {},
            registryEntries,
        );
        super([rootDataObjectFactory.registryEntry], [], [defaultRouteRequestHandler(rootDataStoreId)]);
        this.rootDataObjectFactory = rootDataObjectFactory;
        this.initialDataObjects = initialDataObjects;
    }

    protected async containerInitializingFirstTime(runtime: IContainerRuntime) {
        await runtime.createRootDataStore(
            this.rootDataObjectFactory.type,
            rootDataStoreId,
        );

        const rootDataObject: RootDataObject = (await runtime.request({ url: "/" })).value;

        const initialDataObjects: Promise<IFluidLoadable>[] = [];
        // If the developer provides additional DataObjects we will create them
        Object.entries(this.initialDataObjects).forEach(([id, dataObjectClass]) => {
            initialDataObjects.push(rootDataObject.create(dataObjectClass, id));
        });

        await Promise.all(initialDataObjects);
    }
}
