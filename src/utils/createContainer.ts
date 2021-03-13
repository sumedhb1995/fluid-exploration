import { Fluid } from "@fluid-experimental/fluid-static";
import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import { TinyliciousService } from "@fluid-experimental/get-container";
import { ContainerType } from "../types";

export interface ContainerDefinition {
    type: ContainerType;
    initialDataObjectIds: string[];
}

export function createContainer(def: ContainerDefinition) {
    const load = async () => {
        const service = new TinyliciousService();
        const id = `${def.type}_${Date.now()}`;
        const fluidContainer = await Fluid.createContainer(service, id, [KeyValueDataObject])

        const dataObjects: Promise<any>[] = [];

        for (let id of def.initialDataObjectIds) {
            dataObjects.push(await fluidContainer.createDataObject(KeyValueDataObject, id));
        }

        await Promise.all(dataObjects);

        // After the container is loaded set the hash which will navigate to the new instance
        window.location.hash = id;
    }

    load();
}