import {
    IFluidStaticDataObjectClass,
    IFluidStaticSharedObjectClass,
 } from "./containerCode";

export function isIFluidStaticDataObjectClass(obj: any): obj is IFluidStaticDataObjectClass {
    return obj?.factory !== undefined;
}

export function isIChannelFactoryCreator(obj: any): obj is IFluidStaticSharedObjectClass {
    return obj?.getFactory !== undefined;
}