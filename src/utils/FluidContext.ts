import React from 'react';
import { FluidContainer } from "@fluid-experimental/fluid-static";

export const FluidContext = React.createContext<FluidContainer>(({} as unknown) as FluidContainer);