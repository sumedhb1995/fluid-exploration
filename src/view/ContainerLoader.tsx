import React from "react";
import { FluidContainer } from "@fluid-experimental/fluid-static";
import { Fluid } from "@fluid-experimental/fluid-static";
import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import { TinyliciousService } from "@fluid-experimental/get-container";

import { MouseTracker } from "./MouseTracker";
import { ContainerType } from "../types";
import { TimeClicker } from "./TimeClicker";
import { FluidContext } from "../utils/FluidContext";
import { NoteBoard } from "./NoteBoard";
import { DiceRollerDataObject } from "../dataObjects/DiceRoller";
import { DiceRoller } from "./DiceRoller";

function useFluidContainer(id: string): [FluidContainer | undefined, boolean] {
    const [loadingFailed, setLoadingFailed] = React.useState(false);
    const [container, setContainer] = React.useState<FluidContainer>();

    React.useEffect(() => {
        const load = async () => {
            const service = new TinyliciousService();
            try {
                // Every container is only loaded with a KVDO. If we decided to do schemas we can make these more complex
                // and use the type to key off the container config.
                const fluidContainer = await Fluid.getContainer(service, id, [KeyValueDataObject, DiceRollerDataObject]);
                setContainer(fluidContainer);
            } catch(e) {
                console.log(e);
                setLoadingFailed(true);
            }
        }

        load();
    }, [id]);

    return [container, loadingFailed]
}

interface ContainerLoaderProps {
    id: string;
    type: ContainerType;
}

export function ContainerLoader(props: ContainerLoaderProps) {
    const [container, loadingFailed] = useFluidContainer(props.id);

    return container ? 
    <FluidContext.Provider value={container}>
        {
            props.type === "mouse" ? 
            <MouseTracker />
            : props.type === "time" ?
            <TimeClicker />
            : props.type === "noteboard" ?
            <NoteBoard />
            : props.type === "dice-roller" ?
            <DiceRoller />
            : <div>😢 Error: Unknown container type [{props.type}]</div>
        }
    </FluidContext.Provider>
    : loadingFailed
    ? <div>Fluid Failed to Load. Maybe your server isn't running? Check the Console Log.</div>
    : <div>Loading...</div>
}