import React from "react";
import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import { FluidContext } from "../utils/FluidContext";
import { ContainerDefinition } from "../utils/createContainer";

export const MouseContainerDefinition: ContainerDefinition = {
    type: "mouse",
    initialDataObjectIds: ["mouse-track-info"],
}

interface CursorInfo {
    x: number;
    y: number;
    color: string;
    active: boolean;
}

const userId = (Date.now()*Math.random()).toString();

export function useMouseTracker(): Record<string, CursorInfo> {
    const [data, setData] = React.useState<Record<string,CursorInfo>>({});
    const [dataObject, setDataObject] = React.useState<KeyValueDataObject | undefined>();
    const container = React.useContext(FluidContext);

    React.useEffect(() => {
        const load = async () => {
            const keyValueDataObject = await container.getDataObject("mouse-track-info");
            setDataObject(keyValueDataObject);
        }

        load();
    }, [container]);

    React.useEffect(() => {
        if (dataObject) {
            const updateData = () => setData(dataObject.query());
            updateData();
            dataObject.on("changed", updateData);

            let lastUpdateTime = 0;
            const updateMouse = (event: MouseEvent) => {

                // We want to avoid spamming the server and the cursor can move faster than the screen can paint.
                const currentTime = Date.now();
                if (currentTime - lastUpdateTime < 5) {
                    lastUpdateTime = currentTime;
                    return;
                }

                lastUpdateTime = currentTime;
                let cursorInfo: CursorInfo = dataObject.get(userId) ?? { x:event.pageX, y:event.pageY, color: getRandomColor(), active: true};
                cursorInfo.x = event.pageX;
                cursorInfo.y = event.pageY;
                cursorInfo.active = true;
                dataObject.set(userId, cursorInfo);
            }

            document.addEventListener("mousemove", updateMouse);

            const handleMouseEnter = () => {
                document.addEventListener("mousemove", updateMouse);
            }
            document.addEventListener("mouseenter", handleMouseEnter);

            const handleMouseLeave= () => {
                document.removeEventListener("mousemove", updateMouse);

                const cursorInfo: CursorInfo = dataObject.get(userId);
                if (cursorInfo === undefined) return;

                cursorInfo.active = false;
                dataObject.set(userId, cursorInfo);
            }
            document.addEventListener("mouseleave", handleMouseLeave);
            return () => { 
                // TODO: We need to ensure the developer has a way to close the container
                // It's currently running in the background
                document.removeEventListener("mousemove", updateMouse);
                document.removeEventListener("mouseenter", handleMouseEnter);
                document.removeEventListener("mouseleave", handleMouseLeave);
                dataObject.off("changed", updateData)
            }
        }
    }, [dataObject]);

    return data;
}

export function MouseTracker() {
    const data = useMouseTracker();

    const cursors = [];
    for (let key in data) {
        const item = data[key];
        if (item.active) {
            cursors.push(<CursorIcon info={item} id={key} />)
        }
    }

    return (<>{cursors}</>);
}

interface CursorIconProps {
    info: CursorInfo,
    id: string,
}

function CursorIcon(props: CursorIconProps) {
    const style: React.CSSProperties = {
        zIndex: 1000,
        position: "fixed",
        top: props.info.y - 10,
        left: props.info.x - 10,
        width: "20px",
        height: "20px",
        backgroundColor: props.info.color,
        borderRadius: "10px",
        boxShadow: `0 0 5 .5 ${props.info.color}`,
        pointerEvents: "none",
    };
    return (<div key={props.id} style={style}></div>);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
