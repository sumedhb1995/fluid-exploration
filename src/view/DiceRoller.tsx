import React from "react";
import { DiceRollerDataObject } from "../dataObjects/DiceRoller";
import { ContainerDefinition } from "../utils/createContainer";
import { FluidContext } from "../utils/FluidContext";

export const DiceRollerContainerDefinition: ContainerDefinition = {
    type: "dice-roller",
    initialDataObjectIds: { "dice-roller-key": DiceRollerDataObject },
}

export function useDiceRollerDataObject(): DiceRollerDataObject | undefined {
    const [dataObject, setDataObject] = React.useState<DiceRollerDataObject | undefined>();
    const container = React.useContext(FluidContext);

    React.useEffect(() => {
        const load = async () => {
            const keyValueDataObject = await container.getDataObject("dice-roller-key");
            setDataObject(keyValueDataObject);
        }

        load();
    }, [container]);

    return dataObject;
}

export function DiceRoller() {
    const dataObject = useDiceRollerDataObject()

    return dataObject
        ? dataObject.render()
        : <div>Loading DiceRoller </div>;
}
