import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import { DataObject } from "@fluidframework/aqueduct";
import React from "react";
import { FluidContext } from "./FluidContext";

type DataMapping<T=any> = Record<string, T>;
type SetKVPair<T=any> = (key: string, value: T) => void;

export function useDataObject<T extends DataObject>(id: string): T | undefined {
    const [dataObject, setDataObject] = React.useState<T | undefined>();
    const container = React.useContext(FluidContext);

    React.useEffect(() => {
        const load = async () => {
            const keyValueDataObject = await container.getDataObject(id);
            setDataObject(keyValueDataObject);
        }

        load();
    }, [id, container]);

    return dataObject;
}

export function useKeyValueDataObject<T = any>(id: string): [DataMapping<T>, SetKVPair<T>, boolean] {
    const [data, setData] = React.useState<DataMapping>({});
    const dataObject = useDataObject<KeyValueDataObject>(id);

    React.useEffect(() => {
        if (!dataObject) return;
        const updateData = () => setData(dataObject.query());
        updateData();
        dataObject.on("changed", updateData);
        return () => {dataObject.off("change", updateData)};
    }, [dataObject]);

    const setPair = dataObject
        ? dataObject.set
        : () => { throw new Error(`Attempting to write to DataObject ${id} that is not yet loaded`)};
    return [data, setPair, dataObject === undefined];
}
