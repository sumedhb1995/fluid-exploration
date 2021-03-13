import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import { FluidContainer } from "@fluid-experimental/fluid-static";
import React from "react";

type KVData = Record<string, any>;
type SetKVPair = (key: string, value: any) => void;

export function useKeyValueDataObject(id: string, container: FluidContainer): [KVData, SetKVPair | undefined] {
    const [data, setData] = React.useState<KVData>({});
    const [dataObject, setDataObject] = React.useState<KeyValueDataObject | undefined>();

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
