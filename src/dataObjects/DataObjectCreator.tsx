/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { EventEmitter } from "events";
import {
    DataObject,
    DataObjectFactory,
} from "@fluidframework/aqueduct";
import { IFluidHandle, IFluidLoadable } from "@fluidframework/core-interfaces";
import { IEvent } from "@fluidframework/common-definitions";
import { IValueChanged } from "@fluidframework/map";
import { ISharedObjectEvents } from "@fluidframework/shared-object-base";
import { requestFluidObject } from "@fluidframework/runtime-utils";

const diceValueKey = "diceValue";

/**
 * IDiceRoller describes the public API surface for our dice roller Fluid object.
 */
export interface IDataObjectCreator extends EventEmitter {
    create(type: string): Promise<string>;

    get<T extends DataObject>(id: string): Promise<T>;

    ids: string[];
}

export interface IDataObjectCreatorEvents
    extends ISharedObjectEvents {

    (event: "change", listener: (newId: string, ids: string[]) => void): void;
}

export class DataObjectCreator extends DataObject<object, undefined, IDataObjectCreatorEvents> implements IDataObjectCreator {
    public static readonly factory = new DataObjectFactory<DataObjectCreator, undefined, undefined, IEvent>
        (
            // Note: factory types cannot have "/" or things break
            "data-object-creator",
            DataObjectCreator,
            [],
            {},
        );

    protected async initializingFirstTime() {
    }

    protected async hasInitialized() {
        this.root.on("valueChanged", (changed: IValueChanged) => {
            if (changed.key === diceValueKey) {
                this.emit("diceRolled");
            }
        });
    }

    public get ids() {
        return Array.from(this.root.keys());
    }


    public create = async (type: string): Promise<string> => {
        const router = await this.context.containerRuntime.createDataStore(type);
        const object = await requestFluidObject<IFluidLoadable>(router, "/");
        const id = Math.floor(Date.now()*Math.random()).toString();
        this.root.set(id, object.handle);
        return id;
    }

    public get = async <T extends DataObject>(id: string): Promise<T> => {
        const dataObject = await this.root.get<IFluidHandle<T>>(id)?.get();

        if (!dataObject) {
            throw new Error(`tried to get DataObject with id [${id}] that does not exist.`)
        }

        return dataObject;
    };
}
