import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import React, { useContext } from "react";
import { FluidContext } from "./FluidContext";

type DataMapping<T=any> = Record<string, T>;
type SetKVPair<T=any> = (key: string, value: T) => void;

export function useKeyValueDataObject<T = any>(id: string): [DataMapping<T>, SetKVPair<T>, boolean] {
    const [data, setData] = React.useState<DataMapping>({});
    const [dataObject, setDataObject] = React.useState<KeyValueDataObject | undefined>();
    const container = useContext(FluidContext);

    React.useEffect(() => {
        const load = async () => {
            const keyValueDataObject = await container.getDataObject(id);
            setDataObject(keyValueDataObject);
        }

        load();
    }, [id, container]);

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
