import { createContainer } from "../utils/createContainer";
import { MouseContainerDefinition } from "./MouseTracker";
import { NoteBoardContainerDefinition } from "./NoteBoard";
import { TimeClickerContainerDefinition } from "./TimeClicker";
/**
 * Simple page that has buttons to load different experiences powered by Fluid
 */
export function Home() {
    return (
    <div>
        <button onClick={() => {createContainer(MouseContainerDefinition)}}>New Mouse Tracker</button>
        <button onClick={() => {createContainer(TimeClickerContainerDefinition)}}>New Time Clicker</button>
        <button onClick={() => {createContainer(NoteBoardContainerDefinition)}}>New NoteBoard</button>
    </div>)
}