import { ContainerCreateConfig } from "@fluid-experimental/fluid-static";

export type ContainerType = "mouse" | "time" | "noteboard" | "dice-roller" | "multi-time-clicker" | "multi-time-clicker-2";

export interface ContainerDefinition {
    type: ContainerType;
    config: ContainerCreateConfig;
}