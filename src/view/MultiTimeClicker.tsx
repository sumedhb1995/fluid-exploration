import React from "react";
import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import { ContainerDefinition } from "../utils/createContainer";
import { FluidContext } from "../utils/FluidContext";
import { useKeyValueDataObject } from "../utils/useDataObject";

import { TimeClickerItem } from "./TimeClicker";

export const MultiTimeClickerContainerDefinition: ContainerDefinition = {
    type: "multi-time-clicker",
    initialDataObjectIds: {"object-ids": KeyValueDataObject},
}

export function MultiTimeClicker() {
    const [data, setPair, loading] = useKeyValueDataObject("object-ids");
    const container = React.useContext(FluidContext);

    if (loading) return <div>Loading... </div>;
    
    const createNewTimeClicker = async () => {
        const id = Date.now().toString();
        await container.createDataObject(KeyValueDataObject, id);

        setPair(id, "");
    }

    const items = [];

    for (let key in data) {
        items.push(<TimeClickerItem id={key} /> )
    }

    return (
        <div className="App">
            <button onClick={() => {createNewTimeClicker()}}>New Item</button>
            <div>{items}</div>
        </div>
    );
}

