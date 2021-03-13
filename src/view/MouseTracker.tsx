import React from "react";
import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import { FluidContext } from "../utils/FluidContext";

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
            const keyValueDataObject = await container.getDataObject("default");
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

            document.onmousemove = updateMouse;
            document.onmouseenter = () => {
                document.onmousemove = updateMouse;
            }
            document.onmouseleave = () => {
                document.onmousemove = null;

                const cursorInfo: CursorInfo = dataObject.get(userId);
                if (cursorInfo === undefined) return;

                cursorInfo.active = false;
                dataObject.set(userId, cursorInfo);
            }
            return () => { dataObject.off("changed", updateData) }
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
            cursors.push(<CursorIcon info={item} key={key} />)
        }
    }

    return (<div>{cursors}</div>);
}

interface CursorIconProps {
    info: CursorInfo,
    key: string,
}

function CursorIcon(props: CursorIconProps) {
    const style: React.CSSProperties = {
        position: "absolute",
        top: props.info.y - 10,
        left: props.info.x - 10,
        width: "20px",
        height: "20px",
        backgroundColor: props.info.color,
        borderRadius: "10px",
        boxShadow: `0 0 5 .5 ${props.info.color}`,
    };
    return (<div key={props.key} style={style}></div>);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
