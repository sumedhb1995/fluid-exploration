import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import { SharedMap } from "@fluidframework/map";
import React from "react";
import { FluidObject } from "../fluidStatic";
import { FluidContext } from "./FluidContext";

/**
 * Loads a DataObject of a given type
 */
export function useFluidObject<T extends FluidObject>(id: string): T | undefined {
    const [obj, setObj] = React.useState<T | undefined>();
    const container = React.useContext(FluidContext);

    React.useEffect(() => {
        const load = async () => {
            const keyValueDataObject = await container.get<T>(id);
            setObj(keyValueDataObject);
        }

        load();
    }, [id, container]);

    return obj;
}

/**
 * Loads a KeyValueDataObject with a given schema.
 * Note: There is no way to remove items from the KVPair.
 * 
 * @returns - [strongly typed object, function to set a key/value, loading boolean]
 */
export function useKeyValuePair<T = any>(id: string): [Record<string, T>, (key: string, value: T) => void, boolean] {
    const [data, setData] = React.useState<Record<string, T>>({});
    const kvPair = useFluidObject<KeyValueDataObject>(id);

    React.useEffect(() => {
        if (kvPair) {
            const updateData = () => setData(kvPair.query());
            updateData();
            kvPair.on("changed", updateData);
            return () => {kvPair.off("change", updateData)};
        }
    }, [kvPair]);

    const setPair = kvPair
        ? kvPair.set
        : () => { throw new Error(`Attempting to write to DataObject ${id} that is not yet loaded. Ensure you are waiting on the loading boolean.`)};
    return [data, setPair, kvPair === undefined];
}

/**
 * Loads a KeyValueDataObject with a given schema.
 * Note: There is no way to remove items from the KVPair.
 * 
 * @returns - [strongly typed object, function to set a key/value, loading boolean]
 */
export function useSharedMap<T = any>(id: string): [Record<string, T>, (key: string, value: T) => void, boolean] {
    const [data, setData] = React.useState<Record<string, T>>({});
    const map = useFluidObject<SharedMap>(id);

    React.useEffect(() => {
        if (map) {
            const updateData = () => setData(Object.fromEntries(map.entries()));
            updateData();
            map.on("changed", updateData);
            return () => {map.off("change", updateData)};
        }
    }, [map]);

    const setPair = map
        ? map.set
        : () => { throw new Error(`Attempting to write to DataObject ${id} that is not yet loaded. Ensure you are waiting on the loading boolean.`)};
    return [data, setPair, map === undefined];
}
