import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import { SharedMap } from "@fluidframework/map";
import { ContainerDefinition } from "../utils/types";
import { useKeyValuePair } from "../utils/useDataObject";

export const TimeClickerContainerDefinition: ContainerDefinition = {
    type: "time",
    config: {
        dataObjects: [KeyValueDataObject, SharedMap],
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
        <>
            <TimeClickerItem id={"time-clicker-data"} />
            {/* <TimeClickerItem id={"time-clicker-map"} /> */}
        </>
    );
}

/**
 * Given an id for a DataObject that exists it will generate a TimeClicker
 */
export function TimeClickerItem(props: {id: string}) {
    const [data, setPair, loading] = useKeyValuePair<number>(props.id);
    
    if (loading) return <div>Loading... </div>;

    return (
    <div className="App">
        <button onClick={() => setPair("time", Date.now())}>
        { data.time ?? "Click Me 😎" }
            </button>
    </div>);
}