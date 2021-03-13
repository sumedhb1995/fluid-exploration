import { useKeyValueDataObject } from "../utils/useDataObject";

export function TimeClicker() {
    const [data, setPair] = useKeyValueDataObject("default")

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
