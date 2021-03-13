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

export function MouseTracker() {
    const [data, setData] = React.useState<{ [key: string]: CursorInfo }>({});
    const [dataObject, setDataObject] = React.useState<KeyValueDataObject>();
    const fluidContainer = React.useContext(FluidContext);

    React.useEffect(() => {
        if (!dataObject) {
            const load = async () => {
                const keyValueDataObject = await fluidContainer.getDataObject('default');
                setDataObject(keyValueDataObject);
            }
            load();
        }
    }, []);

    React.useEffect(() => {
        if (dataObject) {
            const updateData = () => setData(dataObject.query());
            updateData();
            dataObject.on("changed", updateData);

            const updateMouse = (event: MouseEvent) => {
                let cursorInfo: CursorInfo = dataObject.get(userId) ?? { x:event.pageX, y:event.pageY, color: getRandomColor(), active: true};
                cursorInfo.x = event.pageX;
                cursorInfo.y = event.pageY;
                cursorInfo.active = true;
                dataObject.set(userId, cursorInfo);
            }

            document.onmousemove = updateMouse;
            document.onmouseenter = updateMouse;
            document.onmouseleave = () => {
                const cursorInfo: CursorInfo = dataObject.get(userId);
                cursorInfo.active = false;
                dataObject.set(userId, cursorInfo);
            }
            return () => { dataObject.off("change", updateData) }
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

    return (<div>
        <p>foo</p>
        {cursors}</div>)
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

/*
const userId = (Date.now()*Math.random()).toString();

interface CursorInfo {
    x: number;
    y: number;
    color: string;
    active: boolean;
}

    const [data, setData] = React.useState<{ [key: string]: any }>({});
    const [dataObject, setDataObject] = React.useState<KeyValueDataObject>();


    React.useEffect(() => {
        if (dataObject === undefined) {
            // First time: create/get the Fluid container, then create/get KeyValueDataObject
            const { containerId, isNew } = getContainerId();
            const load = async () => {
                const service = new TinyliciousService();
                const fluidContainer = isNew
                    ? await Fluid.createContainer(service, containerId, [KeyValueDataObject])
                    : await Fluid.getContainer(service, containerId, [KeyValueDataObject]);

                const keyValueDataObject: KeyValueDataObject = isNew
                    ? await fluidContainer.createDataObject(KeyValueDataObject, 'someUniqueId')
                    : await fluidContainer.getDataObject('someUniqueId');

                setDataObject(keyValueDataObject);
            }

            load();
        } else {
            // Second time: set our local state with a query from the KeyValueDataObject
            const updateData = () => setData(dataObject.query());
            updateData();
            dataObject.on("changed", updateData);

            const updateMouse = (event: MouseEvent) => {
                let cursorInfo: CursorInfo = dataObject.get(userId) ?? { x:event.pageX, y:event.pageY, color: getRandomColor(), active: true};
                cursorInfo.x = event.pageX;
                cursorInfo.y = event.pageY;
                cursorInfo.active = true;
                dataObject.set(userId, cursorInfo);
            }

            document.onmousemove = updateMouse;
            document.onmouseenter = updateMouse;
            document.onmouseleave = () => {
                const cursorInfo: CursorInfo = dataObject.get(userId);
                cursorInfo.active = false;
                dataObject.set(userId, cursorInfo);
            }
            return () => { dataObject.off("change", updateData) }
        }
    }, [dataObject]);


    if (!dataObject) return <div />;

    const cursors = [];
    for ( let key in data ){
        const item = data[key] as CursorInfo;
        if (item.active) {
          cursors.push(<CursorIcon {...item} />)
        }
    }

    return (<>{cursors}</>)

    function CursorIcon(props: CursorInfo) {
    const style: React.CSSProperties = {
        position:"absolute",
        top: props.y-10,
        left: props.x-10,
        width:"20px",
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
*/

/*
            // Second time: set our local state with a query from the KeyValueDataObject
            const updateData = () => setData(dataObject.query());
            updateData();
            dataObject.on("changed", updateData);

            const updateMouse = (event: MouseEvent) => {
                let cursorInfo: CursorInfo = dataObject.get(userId) ?? { x:event.pageX, y:event.pageY, color: getRandomColor(), active: true};
                cursorInfo.x = event.pageX;
                cursorInfo.y = event.pageY;
                cursorInfo.active = true;
                dataObject.set(userId, cursorInfo);
            }

            document.onmousemove = updateMouse;
            document.onmouseenter = updateMouse;
            document.onmouseleave = () => {
                const cursorInfo: CursorInfo = dataObject.get(userId);
                cursorInfo.active = false;
                dataObject.set(userId, cursorInfo);
            }
            return () => { dataObject.off("change", updateData) }
        }
*/