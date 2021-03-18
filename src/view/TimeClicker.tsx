import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import { ContainerDefinition } from "../utils/types";
import { useKeyValueDataObject } from "../utils/useDataObject";

export const TimeClickerContainerDefinition: ContainerDefinition = {
    type: "time",
    config: {
        dataObjects: [KeyValueDataObject],
        initialDataObjects: {
            "time-clicker-data": KeyValueDataObject
        },
    }
}

/**
 * Single Hard Coded Time Clicker
 */
export function TimeClicker() {
    return (
        <TimeClickerItem id={"time-clicker-data"} />
    );
}

/**
 * Given an id for a DataObject that exists it will generate a TimeClicker
 */
export function TimeClickerItem(props: {id: string}) {
    const [data, setPair, loading] = useKeyValueDataObject<number>(props.id);
    
    if (loading) return <div>Loading... </div>;

    return (
    <div>
        <button onClick={() => setPair("time", Date.now())}>
        { data.time ?? "Click Me 😎" }
            </button>
    </div>);
}