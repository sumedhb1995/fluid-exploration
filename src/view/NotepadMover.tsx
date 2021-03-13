// import React from "react";
import { FluidContainer } from "@fluid-experimental/fluid-static";
import { useKeyValueDataObject } from "../utils/useDataObjects";


// interface NoteInfo {
//     x: number;
//     y: number;
//     color: string;
//     active: boolean;
// }

// const userId = (Date.now() * Math.random()).toString();

export function NotePadMover(props: { container: FluidContainer }) {
    const [data, setPair] = useKeyValueDataObject("default", props.container)

    if (!setPair) return <div>Loading DataObject </div>;

    return (
        <div className="App">
            <button onClick={() => setPair("time", Date.now())}>
                click
            </button>
            <span>{data.time}</span>
        </div>
    );
}

// function CursorIcon(props: CursorInfo) {
//     const style: React.CSSProperties = {
//         position: "absolute",
//         top: props.y - 10,
//         left: props.x - 10,
//         width: "20px",
//         height: "20px",
//         backgroundColor: props.color,
//         borderRadius: "10px",
//         boxShadow: `0 0 5 .5 ${props.color}`,
//     };
//     return (<div style={style}></div>);
// }

// function getRandomColor() {
//     var letters = '0123456789ABCDEF';
//     var color = '#';
//     for (var i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }
