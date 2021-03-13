import React from "react";
import { KeyValueDataObject } from "@fluid-experimental/data-objects";
import { FluidContainer } from "@fluid-experimental/fluid-static";

interface CursorInfo {
    x: number;
    y: number;
    color: string;
    active: boolean;
}

const userId = (Date.now()*Math.random()).toString();

export function MouseTracker(props: {container: FluidContainer}) {
    const [data, setData] = React.useState<{ [key: string]: CursorInfo }>({});
    const [dataObject, setDataObject] = React.useState<KeyValueDataObject>();

    React.useEffect(() => {
        const load = async () => {
            const keyValueDataObject = await props.container.getDataObject('default');
            setDataObject(keyValueDataObject);
        }
        load();
    }, [props.container]);

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

    // update the view below

    if (!dataObject) return <div>Loading DataObject </div>;

    const cursors = [];
    for (let key in data) {
        const item = data[key] as CursorInfo;
        if (item.active) {
            cursors.push(<CursorIcon {...item} />)
        }
    }

    return (
        <div>
            {cursors}
        </div>);
}

function CursorIcon(props: CursorInfo) {
    const style: React.CSSProperties = {
        position: "absolute",
        top: props.y - 10,
        left: props.x - 10,
        width: "20px",
        height: "20px",
        backgroundColor: props.color,
        borderRadius: "10px",
        boxShadow: `0 0 5 .5 ${props.color}`,
    };
    return (<div style={style}></div>);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
