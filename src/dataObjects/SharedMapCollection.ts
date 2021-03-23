/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { EventEmitter } from "events";
import {
    DataObject,
    DataObjectFactory,
} from "@fluidframework/aqueduct";
import { IFluidHandle } from "@fluidframework/core-interfaces"
import { ISharedDirectory, ISharedMap, IValueChanged, SharedMap } from "@fluidframework/map";

export interface ISharedMapCollection extends EventEmitter {
    readonly ids: string[];
    get: (id: string) => ISharedMap | undefined;
    create: (id: string) => ISharedMap;

    delete: (id: string) => void;

    on(event: "newMap", listener: () => void): this;
}

/**
 * This is easier to use but loads everything into memory
 */
export class SharedMapCollection extends DataObject implements ISharedMapCollection {
    // in memory mirror of the root object
    private mapCollection: Map<string, ISharedMap> = new Map();

    public get theRoot(): ISharedDirectory {
        return this.root;
    }

    public get ids(): string[] {
        return Array.from(this.root.keys());
    }

    public static readonly factory = new DataObjectFactory
        (
            // Note: factory types cannot have "/" or things break
            "shared-map-collection",
            SharedMapCollection,
            [],
            {},
        );

    protected async initializingFirstTime() {
        // TODO: We should have a way to initialize initial maps
    }

    protected async hasInitialized() {
        this.root.on("valueChanged", (changed: IValueChanged) => {
            const loadMap = async () => {
                const newMap = await this.root.get<IFluidHandle<ISharedMap>>(changed.key)?.get();
                if (newMap === undefined) {
                    // this can happen if the map is deleted
                    alert("map delete");
                    this.mapCollection.delete(changed.key);
                    return;
                }
                this.mapCollection.set(changed.key, newMap);
                this.emit("newMap", changed.key, newMap);
            }
            loadMap();
        });

        const mapLoadPromises: Promise<void>[] = [];
        // Load all maps
        console.log("loading keys" + Array.from(this.root.keys()).length)
        for (const key in this.root.keys()) {
            const load = async () => {
                try {

                    const map = await this.root.get<IFluidHandle<ISharedMap>>(key)!.get();
                    this.mapCollection.set(key, map);
                } catch {
                    console.log(`Failed to load map with key: [${key}]`);
                }
            }
            mapLoadPromises.push(load());
        }

        await Promise.all(mapLoadPromises);
    }

    public get(id: string): ISharedMap | undefined {
        return this.mapCollection.get(id);
    }

    public create(id: string): ISharedMap{
        const map = SharedMap.create(this.runtime);
        this.root.set(id, map.handle);
        return map;
    }

    public delete(id: string): void {
        this.root.delete(id);
        this.mapCollection.delete(id);
    }
}


 export interface ISharedMapAsyncCollection extends EventEmitter {
    readonly ids: string[];
    readonly maps: ISharedMap[];
    get: (id: string) => Promise<ISharedMap | undefined>;
    create: (id: string) => ISharedMap;
    delete: (id: string) => void;

    on(event: "newMap", listener: () => void): this;
}

/**
 * This map allows you to virtualize your maps where the normal one loads them all in memory
 */
export class SharedMapAsyncCollection extends DataObject implements ISharedMapAsyncCollection {

    public get maps(): ISharedMap[] {
        return Array.from(this.root.values());
    }

    public get ids(): string[] {
        return Array.from(this.root.keys());
    }

    public static readonly factory = new DataObjectFactory
        (
            // Note: factory types cannot have "/" or things break
            "shared-map-collection",
            SharedMapCollection,
            [],
            {},
        );

    protected async initializingFirstTime() {
        // TODO: We should have a way to initialize initial maps
    }

    protected async hasInitialized() {
        this.root.on("valueChanged", (changed: IValueChanged) => {
            this.emit("newMap", changed.key);
        });
    }

    public async get(id: string): Promise<ISharedMap | undefined> {
        return this.root.get<IFluidHandle<ISharedMap>>(id)?.get();
    }

    public create(id: string): ISharedMap{
        const map = SharedMap.create(this.runtime);
        this.root.set(id, map.handle);
        return map;
    }

    public delete(id: string): void {
        this.root.delete(id);
    }
}
