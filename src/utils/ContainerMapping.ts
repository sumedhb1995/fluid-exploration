import { DiceRollerContainerDefinition } from "../view/DiceRoller";
import { DiceRollerRemoteContainerDefinition } from "../view/DiceRollerRemote";
import { MouseContainerDefinition } from "../view/MouseTracker";
import { MultiTimeClickerContainerDefinition } from "../view/MultiTimeClicker";
import { NoteBoardContainerDefinition } from "../view/NoteBoard";
import { TimeClickerContainerDefinition } from "../view/TimeClicker";

export const ContainerMapping = {
    [DiceRollerContainerDefinition.type]: DiceRollerContainerDefinition,
    [DiceRollerRemoteContainerDefinition.type]: DiceRollerRemoteContainerDefinition,
    [MouseContainerDefinition.type]: MouseContainerDefinition,
    [MultiTimeClickerContainerDefinition.type]: MultiTimeClickerContainerDefinition,
    [NoteBoardContainerDefinition.type]: NoteBoardContainerDefinition,
    [TimeClickerContainerDefinition.type]: TimeClickerContainerDefinition,
}