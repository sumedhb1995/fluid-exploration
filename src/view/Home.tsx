import { Fluid } from "@fluid-experimental/fluid-static";
import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import { TinyliciousService } from "@fluid-experimental/get-container";

/**
 * Has a button that creates a new container.
 */
export function Home() {
    const clickHandler = () => {
        const load = async () => {
            const service = new TinyliciousService();
            const id = Date.now().toString();
            const fluidContainer = await Fluid.createContainer(service, id, [KeyValueDataObject])
            await fluidContainer.createDataObject(KeyValueDataObject, 'default')

            // After the container is loaded set the hash which will navigate to the new instance
            window.location.hash = id;
        }

        load();
    }
    return (
    <div>
        <button onClick={clickHandler}>New Container</button>
    </div>)
}