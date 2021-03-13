import React from "react";
import { FluidContainer } from "@fluid-experimental/fluid-static";
import { Fluid } from "@fluid-experimental/fluid-static";
import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import { TinyliciousService } from "@fluid-experimental/get-container";

import { MouseTracker } from "./MouseTracker";
import { FluidContext } from "../utils/FluidContext";


interface ContainerLoaderProps {
    id: string;
}

export function ContainerLoader(props: ContainerLoaderProps) {
    const [container, setContainer] = React.useState<FluidContainer>();
    React.useEffect(() => {
        // First time: create/get the Fluid container, then create/get KeyValueDataObject
        const load = async () => {
            const service = new TinyliciousService();
            try {
                const fluidContainer = await Fluid.getContainer(service, props.id, [KeyValueDataObject]);
                setContainer(fluidContainer);
            } catch(e) {
                console.log(e);
            }
        }

        load();

    }, []);

    return container ? 
    <FluidContext.Provider value={container}>
        <MouseTracker />
    </FluidContext.Provider>
    : <div>Loading...</div>
}