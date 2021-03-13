import React from "react";
import { FluidContainer } from "@fluid-experimental/fluid-static";
import { Fluid } from "@fluid-experimental/fluid-static";
import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import { TinyliciousService } from "@fluid-experimental/get-container";

import { MouseTracker } from "./MouseTracker";
import { ContainerType } from "../types";
import { TimeClicker } from "./TimeClicker";


interface ContainerLoaderProps {
    id: string;
    type: ContainerType;
}

export function ContainerLoader(props: ContainerLoaderProps) {
    const [loadingFailed, setLoadingFailed] = React.useState(false);
    const [container, setContainer] = React.useState<FluidContainer>();

    React.useEffect(() => {
        const load = async () => {
            const service = new TinyliciousService();
            try {
                const fluidContainer = await Fluid.getContainer(service, props.id, [KeyValueDataObject]);
                setContainer(fluidContainer);
            } catch(e) {
                console.log(e);
                setLoadingFailed(true);
            }
        }

        load();

    }, [props.type, props.id]);

    return container ? 
    <>    
        {
            props.type === "mouse" ? 
            <MouseTracker container={container}/>
            : props.type === "time" ?
            <TimeClicker container={container}/>
            : <div>Error 😢</div>
        }
    </>
    : loadingFailed
    ? <div>Fluid Failed to Load. Maybe your server isn't running? Check the Console Log.</div>
    : <div>Loading...</div>
}