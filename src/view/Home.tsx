import Fluid from "@fluid-experimental/fluid-static";

import { DiceRollerContainerDefinition } from "./DiceRoller";
import { MultiTimeClickerContainerDefinition } from "./MultiTimeClicker";
import { MouseContainerDefinition } from "./MouseTracker";
import { NoteBoardContainerDefinition } from "./NoteBoard";
import { TimeClickerContainerDefinition } from "./TimeClicker";
import { ContainerDefinition } from "../utils/types";

/**
 * Simple page that has buttons to load different experiences powered by Fluid
 */
export function Home() {
    // createContainer navigates after the async function completes
    const createContainer = async (def: ContainerDefinition) => {
        const id = `${def.type}_${Date.now()}`;
        await Fluid.createContainer(id, def.config)

        console.log(`Created Container of type [${def.type}] navigating`);

        // After the container is loaded set the hash which will navigate to the new instance
        window.location.hash = id;
    }
    return (
    <div>
        <button onClick={() => {createContainer(MouseContainerDefinition)}}>New Mouse Tracker</button>
        <button onClick={() => {createContainer(TimeClickerContainerDefinition)}}>New Time Clicker</button>
        <button onClick={() => {createContainer(NoteBoardContainerDefinition)}}>New Note Board</button>
        <button onClick={() => {createContainer(DiceRollerContainerDefinition)}}>New DiceRoller</button>
        <button onClick={() => {createContainer(MultiTimeClickerContainerDefinition)}}>New Multi Time Clicker</button>
        <button onClick={() => {createContainer(MultiTimeClickerContainerDefinition)}}>New Multi Time Clicker 2</button>
    </div>)
}