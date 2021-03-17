/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { EventEmitter } from "events";
import {
    DataObject,
    DataObjectFactory,
} from "@fluidframework/aqueduct";
import { IEvent } from "@fluidframework/common-definitions";
import { IValueChanged } from "@fluidframework/map";
import { IFluidHTMLView } from "@fluidframework/view-interfaces";
import React from "react";

const diceValueKey = "diceValue";

/**
 * IDiceRoller describes the public API surface for our dice roller Fluid object.
 */
interface IDiceRoller extends EventEmitter {
    /**
     * Get the dice value as a number.
     */
    readonly value: number;

    /**
     * Roll the dice.  Will cause a "diceRolled" event to be emitted.
     */
    roll: () => void;

    /**
     * The diceRolled event will fire whenever someone rolls the device, either locally or remotely.
     */
    on(event: "diceRolled", listener: () => void): this;
}

interface IDiceRollerViewProps {
    model: IDiceRoller;
}

const DiceRollerView: React.FC<IDiceRollerViewProps> = (props: IDiceRollerViewProps) => {
    const [diceValue, setDiceValue] = React.useState(props.model.value);

    React.useEffect(() => {
        const onDiceRolled = () => {
            setDiceValue(props.model.value);
        };
        props.model.on("diceRolled", onDiceRolled);
        return () => {
            props.model.off("diceRolled", onDiceRolled);
        };
    }, [props.model]);

    // Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
    const diceChar = String.fromCodePoint(0x267F + diceValue);

    return (
        <div>
            <span style={{ fontSize: 50 }}>{diceChar}</span>
            <button onClick={props.model.roll}>Roll</button>
        </div>
    );
};

/**
 * The DiceRoller is our implementation of the IDiceRoller interface.
 */
export class DiceRollerDataObject extends DataObject implements IDiceRoller, IFluidHTMLView {

    public get IFluidHTMLView() { return this; }

    /**
     * This is required to work with FluidStatic but the interface IFluidStaticDataObjectClass doesn't
     * understand this as valid. This is because the interface doesn't apply to static objects. We should think about this.
     */
    public static readonly factory = new DataObjectFactory<DiceRollerDataObject, undefined, undefined, IEvent>
        (
            // Note: factory types cannot have "/" or things break
            "dice-roller",
            DiceRollerDataObject,
            [],
            {},
        );

    /**
     * initializingFirstTime is called only once, it is executed only by the first client to open the
     * Fluid object and all work will resolve before the view is presented to any user.
     *
     * This method is used to perform Fluid object setup, which can include setting an initial schema or initial values.
     */
    protected async initializingFirstTime() {
        this.root.set(diceValueKey, 1);
    }

    protected async hasInitialized() {
        this.root.on("valueChanged", (changed: IValueChanged) => {
            if (changed.key === diceValueKey) {
                this.emit("diceRolled");
            }
        });
    }

    /**
     * Render the dice.
     */
    // public render(div: HTMLElement) {
    //     ReactDOM.render(
    //         <DiceRollerView model={this} />,
    //         div,
    //     );
    // }

    public render() {
        return <DiceRollerView model={this} />
    }

    public get value() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.root.get(diceValueKey);
    }

    public readonly roll = () => {
        const rollValue = Math.floor(Math.random() * 6) + 1;
        this.root.set(diceValueKey, rollValue);
    };
}
