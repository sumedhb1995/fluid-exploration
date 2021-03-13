import { FluidContainer } from "@fluid-experimental/fluid-static";
import React from "react";

/**
 * Having a React Context allows the FluidContainer object to be passed through
 * without using props.
 *
 * This is faking a default to make TypeScript happy. This context will not work
 * if not initialized with a real object.
 */
export const FluidContext = React.createContext(({} as unknown) as FluidContainer);