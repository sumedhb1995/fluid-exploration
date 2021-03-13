import { ContainerDefinition } from "../utils/createContainer";
import { useKeyValueDataObject } from "../utils/useDataObject";

export const TimeClickerContainerDefinition: ContainerDefinition = {
    type: "time",
    initialDataObjectIds: ["time-clicker-data"],
}

export function TimeClicker() {
    const [data, setPair] = useKeyValueDataObject("time-clicker-data")

    if (!setPair) return <div>Loading DataObject </div>;

    return (
        <div className="App">
            <button onClick={() => setPair("time", Date.now())}>
                click
                </button>
            <span>{data.time}</span>
        </div>
    );
}
