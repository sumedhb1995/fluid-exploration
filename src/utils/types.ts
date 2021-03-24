import { ContainerCreateConfig } from "../fluidStatic";

export type ContainerType =
    "mouse"
    | "time"
    | "noteboard"
    | "dice-roller"
    | "dice-roller-remote"
    | "multi-time-clicker"
    | "collection-example";

export interface ContainerDefinition {
    type: ContainerType;
    config: ContainerCreateConfig;
}