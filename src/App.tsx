
import React from 'react';

import { ContainerLoader } from './view/ContainerLoader';
import { Home } from './view/Home';

import './App.css';
import { ContainerType } from './utils/types';

function App() {
    const getExistingInfo = (): {id: string, type: ContainerType} => {
        const id = window.location.hash.substring(1);
        const type = id.split("_")[0] as ContainerType;
        return {id, type};
    };
    const [state, setState] = React.useState(getExistingInfo());
    const homePage = window.location.hash.length === 0;

    React.useEffect(() =>{
        // set a simple listener that checks if the hash has changed.
        window.onhashchange = ()=> {
            setState(getExistingInfo());
        }
    })

    return (
        <ContentWrapper>
            {
                homePage
                ? <Home />
                : <ContainerLoader id={state.id} type={state.type} />
            }
        </ContentWrapper>);
}

const ContentWrapper : React.FunctionComponent = (props) => {
    const style: React.CSSProperties = {
        margin: "60px 10px 10px 10px",

    }
    return (
        <div style={style}>
            <Header/>
            {props.children}
        </div>)
}

function Header() {
    const headerStyle: React.CSSProperties = {
        left:0,
        top:0,
        height: "50px",
        width: "100vw",
        backgroundColor: "black",
        position: "absolute",
    }
    const iconStyle: React.CSSProperties = {
        position: "absolute",
        left:5,
        top:0,
        fontSize: "35px",
        cursor: "default",
    }
    const buttonStyle: React.CSSProperties = {
        position: "absolute",
        right:15,
        top:15,
        height: "20px",
    }

    const iconClickHandler = () => {
        // navigate home
        window.location.assign('');
    }

    const newWindowClickHandler = () => {
        // navigate home
        window.open(window.location.href);
    }

    return (
        <div style={headerStyle}>
            <div style={iconStyle} onClick={iconClickHandler}>🌊</div>
            <button style={buttonStyle} onClick={newWindowClickHandler}>New Window</button>
        </div>);
}

export default App;
