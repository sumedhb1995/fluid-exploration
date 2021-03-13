import { FluidContainer } from "@fluid-experimental/fluid-static";
import { useKeyValueDataObject } from "../utils/useDataObjects";
// import { FluidContext } from "../utils/FluidContext";

export function TimeClicker(props: { container: FluidContainer }) {
    const [data, setPair] = useKeyValueDataObject("default", props.container)

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
