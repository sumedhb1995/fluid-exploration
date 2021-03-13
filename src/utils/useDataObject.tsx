import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import React, { useContext } from "react";
import { FluidContext } from "./FluidContext";

type KVData<T=any> = Record<string, T>;
type SetKVPair<T=any> = (key: string, value: T) => void;

export function useKeyValueDataObject<T = any>(id: string): [KVData<T>, SetKVPair<T> | undefined] {
    const [data, setData] = React.useState<KVData>({});
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

    // TODO: Is this the right loading case?
    const setPair = dataObject ? dataObject.set: undefined;
    return [data, setPair];
}
