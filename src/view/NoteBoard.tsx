import React from "react";
import { ContainerDefinition } from "../utils/createContainer";
import { useKeyValueDataObject } from "../utils/useDataObject";

export const NoteBoardContainerDefinition: ContainerDefinition = {
    type: "noteboard",
    initialDataObjectIds: ["note-location-data", "note-content-data"],
}

export interface NoteInfo {
    x: number;
    y: number;
    text: string;
}

// const userId = (Date.now()*Math.random()).toString();

export function NoteBoard() {
    const [locationData, setLocationDataItem] = useKeyValueDataObject<{x:number,y:number}>("note-location-data");
    const [contentData, setContentDataItem] = useKeyValueDataObject<string>("note-content-data");

    if (!setLocationDataItem || !setContentDataItem) return <div>Loading...</div>

    const notes = [];
    for (let key in locationData) {
        const item = { ...locationData[key], text: contentData[key]};
    
        const setPosition = (x:number, y:number) => {
            setLocationDataItem(key, {x,y});
        }
        notes.push(<Note info={item} id={key} setPosition={setPosition}/>)
    }

    const newNote = () => {
        const id = (Date.now()*Math.random()).toString();
        // We want to store the content first. If we have content without a location that's okay
        // If we have a location with out content we will render without content.
        setContentDataItem(id, "Important Info");
        setLocationDataItem(id, {x: 10 + (notes.length * 10), y: 40})
    }

    return (
        <div>
            <button onClick={newNote} style={{zIndex:1}} >Create Note</button>
            {notes}
        </div>);
}

interface NoteProps {
    info: NoteInfo,
    id: string,
    setPosition: (x:number, y:number) => void
}

function Note(props: NoteProps) {
    const [color, setColor] = React.useState("yellow");
    const style: React.CSSProperties = {
        zIndex:0,
        position: "absolute",
        top: props.info.y,
        left: props.info.x,
        width: "100px",
        height: "100px",
        backgroundColor: color,
        border: "1px solid black"
    };
    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setColor("blue");
        const shiftX = event.pageX - props.info.x;
        const shiftY = event.pageY - props.info.y;
        document.onmousemove = (event: MouseEvent) =>{
            props.setPosition(event.pageX - shiftX, event.pageY - shiftY);
        }
        // get element location
        // set mouse event listener 
        // align element with mouse as it moves
    }

    const handleMouseUp = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        document.onmousemove = null;
        setColor("yellow");
    }

    return (<div key={props.id} style={style} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}></div>);
}

// function getRandomColor() {
//     var letters = '0123456789ABCDEF';
//     var color = '#';
//     for (var i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }
