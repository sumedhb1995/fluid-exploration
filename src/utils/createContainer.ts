import { Fluid, IFluidStaticDataObjectClass } from "@fluid-experimental/fluid-static";
import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import { TinyliciousService } from "@fluid-experimental/get-container";
import { ContainerType } from "../types";
import { DiceRollerDataObject } from "../dataObjects/DiceRoller";

export interface ContainerDefinition {
    type: ContainerType;
    initialDataObjectIds: Record<string, IFluidStaticDataObjectClass>;
}

export function createContainer(def: ContainerDefinition) {
    const load = async () => {
        const service = new TinyliciousService();
        const id = `${def.type}_${Date.now()}`;

        // Note we should use container configs here
        const fluidContainer = await Fluid.createContainer(service, id, [KeyValueDataObject, DiceRollerDataObject])

        const dataObjects: Promise<any>[] = [];

        for (let key in def.initialDataObjectIds) {
            const dataObject = def.initialDataObjectIds[key]
            dataObjects.push(fluidContainer.createDataObject(dataObject, key));
        }

        await Promise.all(dataObjects);

        console.log(`Created Container of type [${def.type}] navigating`);

        // After the container is loaded set the hash which will navigate to the new instance
        window.location.hash = id;
    }

    load();
}