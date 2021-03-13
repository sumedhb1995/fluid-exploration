import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import { FluidContainer } from "@fluid-experimental/fluid-static";
import React from "react";
// import { FluidContext } from "../utils/FluidContext";

export function TimeClicker(props: { container: FluidContainer }) {
    const [time, setTime] = React.useState(0);
    const [dataObject, setDataObject] = React.useState<KeyValueDataObject>();
    // const fluidContainer = React.useContext(FluidContext);

    React.useEffect(() => {
        const load = async () => {
            const keyValueDataObject = await props.container.getDataObject('default');
            setDataObject(keyValueDataObject);
        }
        load();
        // Should we be offloading the container?
    }, [props.container]);

    React.useEffect(() => {
        if (dataObject) {
            const updateData = () => setTime(dataObject.get("time"));
            updateData();
            dataObject.on("changed", updateData);
            return () => { dataObject.off("changed", updateData) }
        }
    }, [dataObject]);

    // update the view below

    if (!dataObject) return <div>Loading Time Clicker... </div>;

    return (
        <div className="App">
            <button onClick={() => dataObject.set("time", Date.now())}>
                click
            </button>
            <span>{time}</span>
        </div>
    )
}