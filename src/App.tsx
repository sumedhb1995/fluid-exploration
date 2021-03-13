
import React from 'react';
import { ContainerLoader } from './view/ContainerLoader';
import { Home } from './view/Home';

import './App.css';

const getContainerId = (): string=> {
    return window.location.hash.substring(1);
};

function App() {
    const [change, setChange] = React.useState(false);
    const loadExisting = window.location.hash.length !== 0;

    React.useEffect(() =>{
        // set a simple listener that checks if the hash has changed.
        window.onhashchange = ()=> {
            setChange(!change);
        }
    })

    return (
    loadExisting ?
    <ContainerLoader id={getContainerId()}/>
    : <Home />)
}



  

// function timeClicker() {
//     const [data, setData] = React.useState<{ [key: string]: any }>({});
//     const [dataObject, setDataObject] = React.useState<KeyValueDataObject>();

//     return (
//         <div style={{position: "relative", top: "20px"}} className="App">
//             <button onClick={() => dataObject.set("time", Date.now().toString())}>
//                 click
//             </button>
//             <span>{data["time"]}</span>
//         </div>
//     )
// }

export default App;
