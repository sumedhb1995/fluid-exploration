import { EventEmitter } from "events";
import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { IValueChanged } from "@fluidframework/map";

/**
 * IDiceRoller describes the public API surface for our dice roller data object.
 */
export interface IDiceRollerRemoteDataObject extends EventEmitter {
    /**
     * Get the dice value as a number.
     */
    readonly value: number;

    /**
     * Denotes if the session has ended
     */
    readonly ended: boolean;

    /**
     * Roll the dice.  Will cause a "diceRolled" event to be emitted.
     */
    roll: () => void;


    /**
     * Ends the current session
     */
    endSession: () => void;

    /**
     * The diceRolled event will fire whenever someone rolls the device, either locally or remotely.
     */
    on(event: "update", listener: () => void): this;
}

// The root is map-like, so we'll use this key for storing the value.
const diceValueKey = "diceValue";
const sessionEndKey = "sessionEndKey";

/**
 * The DiceRoller is our data object that implements the IDiceRoller interface.
 */
export class DiceRollerRemoteDataObject extends DataObject implements IDiceRollerRemoteDataObject {
    
    /**
     * This is required to work with FluidStatic but the interface IFluidStaticDataObjectClass doesn't
     * understand this as valid. This is because the interface doesn't apply to static objects. We should think about this.
     */
         public static readonly factory = new DataObjectFactory
         (
             // Note: factory types cannot have "/" or things break
             "dice-roller-remote",
             DiceRollerRemoteDataObject,
             [],
             {},
         );
 
    
    /**
     * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
     * initialize the state of the DataObject.
     */
    protected async initializingFirstTime() {
        const value = await this.sendRequest("GET");
        this.root.set(diceValueKey, value);
    }

    /**
     * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
     * DataObject, by registering an event listener for dice rolls.
     */
    protected async hasInitialized() {
        console.log("creating");
        if (this.ended) {
            return;
        }
        this.root.on("valueChanged", (changed: IValueChanged) => {
            if (changed.key === diceValueKey || changed.key === sessionEndKey) {
                // When we see the dice value change, we'll emit the diceRolled event we specified in our interface.
                this.emit("update");
            }
        });

        // check to see if there's a new value if we are loading an old session.
        const response = await this.sendRequest("GET");
        console.log("value:::" + response);
        this.root.set(diceValueKey, response);
    }

    public get ended(): boolean {
        return this.root.get(sessionEndKey) ?? false;
    }

    public readonly endSession = (): void => {
        this.root.set(sessionEndKey, true);
        this.sendRequest("POST", this.value);
    }

    public get value() {
        return this.root.get(diceValueKey);
    }

    public readonly roll = (): void => {
        if (this.ended) {
            return;
        }
        const rollValue = Math.floor(Math.random() * 6) + 1;
        this.root.set(diceValueKey, rollValue);
    };

    private async sendRequest(type: "GET"|"POST", payload?:number): Promise<number> {
        // Creating the XMLHttpRequest object
        var request = new XMLHttpRequest();

        // Instantiating the request object
        request.open(type, "http://localhost:8000");

        // Doing some fancy stuff so I can use async/await
        let res: (value: number | PromiseLike<number>) => void;
        const p = new Promise<number>((r) => res = r);
        // Defining event listener for readystatechange event
        request.onreadystatechange = function() {
            // Check if the request is compete and was successful
            if (request.readyState === request.DONE){
                console.log(`RESPONSE: ${request.status}-${request.responseText}`);
                res(parseInt(request.responseText));   
            }
        };

        // Sending the request to the server
        if (type === "POST") {
            request.send(payload?.toString())
        } else {
            request.send();
        }
        return p;
    }
}