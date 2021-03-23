import { ContainerCreateConfig } from "@fluid-experimental/fluid-static";

export type ContainerType =
    "mouse"
    | "time"
    | "noteboard"
    | "dice-roller"
    | "dice-roller-remote"
    | "multi-time-clicker";

export interface ContainerDefinition {
    type: ContainerType;
    config: ContainerCreateConfig;
}