import React from "react";
import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import { ContainerDefinition } from "../utils/types";
import { FluidContext } from "../utils/FluidContext";
import { useKeyValuePair } from "../utils/useDataObject";

import { TimeClickerItem } from "./TimeClicker";

export const MultiTimeClickerContainerDefinition: ContainerDefinition = {
    type: "multi-time-clicker",
    config: {
        dataObjects: [KeyValueDataObject],
        initialDataObjects: {
            "object-ids": KeyValueDataObject,
        },
    }
}

export function MultiTimeClicker() {
    const [data, setPair, loading] = useKeyValuePair("object-ids");
    const container = React.useContext(FluidContext);

    if (loading) return <div>Loading... </div>;
    
    const createNewTimeClicker = async () => {
        const id = Date.now().toString();
        await container.create(KeyValueDataObject, id);

        // We set the id as a key so we can get them later
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

