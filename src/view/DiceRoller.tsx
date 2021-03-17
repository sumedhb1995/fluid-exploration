import React from "react";
import { DiceRollerDataObject } from "../dataObjects/DiceRoller";
import { ContainerDefinition } from "../utils/createContainer";
import { useDataObject } from "../utils/useDataObject";

export const DiceRollerContainerDefinition: ContainerDefinition = {
    type: "dice-roller",
    initialDataObjectIds: { "dice-roller-key": DiceRollerDataObject },
}

/**
 * This is very future thinking. It demonstrates how DataObjects can contain a view.
 */
export function DiceRoller() {
    const dataObject = useDataObject<DiceRollerDataObject>("dice-roller-key");

    return dataObject
        ? dataObject.render()
        : <div>Loading DiceRoller... </div>;
}
