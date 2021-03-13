
import React from 'react';
import { ContainerLoader } from './view/ContainerLoader';
import { Home } from './view/Home';

import './App.css';
import { ContainerType } from './types';

function App() {
    const getExistingInfo = (): {id: string, type: ContainerType} => {
        const id = window.location.hash.substring(1);
        const type = id.split("_")[0] as ContainerType;
        return {id, type};
    };
    const [state, setState] = React.useState(getExistingInfo());
    const loadExisting = window.location.hash.length !== 0;

    React.useEffect(() =>{
        // set a simple listener that checks if the hash has changed.
        window.onhashchange = ()=> {
            setState(getExistingInfo());
        }
    })

    if (!loadExisting) return <Home />

    return (<ContainerLoader id={state.id} type={state.type} />);
}

export default App;
