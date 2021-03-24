import { ContainerCreateConfig } from "../fluidStatic";
import { CollectionExampleContainerDefinition } from "../view/CollectionExample";
import { DiceRollerContainerDefinition } from "../view/DiceRoller";
import { DiceRollerRemoteContainerDefinition } from "../view/DiceRollerRemote";
import { MouseContainerDefinition } from "../view/MouseTracker";
import { MultiTimeClickerContainerDefinition } from "../view/MultiTimeClicker";
import { NoteBoardContainerDefinition } from "../view/NoteBoard";
import { TextAreaContainerDefinition } from "../view/TextArea";
import { TimeClickerContainerDefinition } from "../view/TimeClicker";

export type ContainerType =
    "mouse"
    | "time"
    | "noteboard"
    | "dice-roller"
    | "dice-roller-remote"
    | "multi-time-clicker"
    | "collection-example"
    | "text-area";

export const ContainerMapping: Record<string, ContainerCreateConfig> = {
    [DiceRollerContainerDefinition.name]: DiceRollerContainerDefinition,
    [DiceRollerRemoteContainerDefinition.name]: DiceRollerRemoteContainerDefinition,
    [MouseContainerDefinition.name]: MouseContainerDefinition,
    [MultiTimeClickerContainerDefinition.name]: MultiTimeClickerContainerDefinition,
    [NoteBoardContainerDefinition.name]: NoteBoardContainerDefinition,
    [TimeClickerContainerDefinition.name]: TimeClickerContainerDefinition,
    [CollectionExampleContainerDefinition.name]: CollectionExampleContainerDefinition,
    [TextAreaContainerDefinition.name]: TextAreaContainerDefinition,
};