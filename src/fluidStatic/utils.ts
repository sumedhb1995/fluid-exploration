import { IChannelFactory } from "@fluidframework/datastore-definitions";
import { IFluidStaticDataObjectClass } from "./containerCode";

export function isIFluidStaticDataObjectClass(obj: any): obj is IFluidStaticDataObjectClass {
    return obj?.factory !== undefined;
}

export function isIChannelFactoryCreator(obj: any): obj is { getFactory: () => IChannelFactory } {
    return obj?.getFactory !== undefined;
}