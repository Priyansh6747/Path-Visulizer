import React from 'react';
import styled from 'styled-components';
import PropTypes from "prop-types";

const Radio = (props) => {
    function handleClick(flag) {
        props.changeFlag(flag);
        props.Enable(false);
    }
    return (
        <StyledWrapper>
            <div className="input">
                <button className="value" onClick={() => handleClick(0)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            fill="white"
                            d="M12 2C6.48 2 2 6.48 2 12c0 4.42 3.58 8 8 8s8-3.58 8-8c0-5.52-4.48-10-8-10zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-9h2v4h-2v-4zm0 6h2v2h-2v-2z"/>
                    </svg>
                    Dijkstra
                </button>
                <button className="value" onClick={() => handleClick(1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            fill="white"
                            d="M12 2L2 7v12l10 5 10-5V7l-10-5zm0 3.27L18.18 8 12 10.73 5.82 8 12 5.27zm0 13.46l-8-4v-4.73L12 17l8-4.73v4l-8 4z"/>
                    </svg>
                    A Star
                </button>
                <button className="value" onClick={() => handleClick(2)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            fill="white"
                            d="M21.65 7.35l-6.32 6.32-.88.88L8 15l1.45-6.66.88-.88L16.65 2.35a.5.5 0 0 1 .71.71l-6.39 6.4.88.88 6.31-6.31a.5.5 0 0 1 .71.71l-6.4 6.39.88.88 6.32-6.32a.5.5 0 0 1 .71.71z"/>
                    </svg>
                    DFS
                </button>
                <button className="value" onClick={() => handleClick(3)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            fill="white"
                            d="M21.65 7.35l-6.32 6.32-.88.88L8 15l1.45-6.66.88-.88L16.65 2.35a.5.5 0 0 1 .71.71l-6.39 6.4.88.88 6.31-6.31a.5.5 0 0 1 .71.71l-6.4 6.39.88.88 6.32-6.32a.5.5 0 0 1 .71.71z"/>
                    </svg>
                    BFS
                </button>
                <button className="value" onClick={() => handleClick(4)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            fill="white"
                            d="M21.65 7.35l-6.32 6.32-.88.88L8 15l1.45-6.66.88-.88L16.65 2.35a.5.5 0 0 1 .71.71l-6.39 6.4.88.88 6.31-6.31a.5.5 0 0 1 .71.71l-6.4 6.39.88.88 6.32-6.32a.5.5 0 0 1 .71.71z"/>
                    </svg>
                    Greedy BFS
                </button>
                <button className="value" onClick={() => handleClick(5)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            fill="white"
                            d="M21.65 7.35l-6.32 6.32-.88.88L8 15l1.45-6.66.88-.88L16.65 2.35a.5.5 0 0 1 .71.71l-6.39 6.4.88.88 6.31-6.31a.5.5 0 0 1 .71.71l-6.4 6.39.88.88 6.32-6.32a.5.5 0 0 1 .71.71z"/>
                    </svg>
                    Bellman Ford
                </button>
                <button className="value" onClick={() => handleClick(6)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            fill="white"
                            d="M21.65 7.35l-6.32 6.32-.88.88L8 15l1.45-6.66.88-.88L16.65 2.35a.5.5 0 0 1 .71.71l-6.39 6.4.88.88 6.31-6.31a.5.5 0 0 1 .71.71l-6.4 6.39.88.88 6.32-6.32a.5.5 0 0 1 .71.71z"/>
                    </svg>
                    Bi Swarn
                </button>
            </div>
        </StyledWrapper>
    );
};

Radio.PropTypes = {
    changeFlag: PropTypes.func.isRequired,
    Enable: PropTypes.func.isRequired,
}


const StyledWrapper = styled.div`
    .input {
        display: flex;
        flex-direction: column;
        width: 125px;
        background-color: #0D1117;
        justify-content: center;
        border-radius: 5px
    }

    .value {
        background-color: transparent;
        border: none;
        padding: 10px;
        color: white;
        display: flex;
        position: relative;
        gap: 5px;
        cursor: pointer;
        border-radius: 4px;
    }

    .value:not(:active):hover,
    .value:focus {
        background-color: #21262C;
    }

    .value:focus,
    .value:active {
        background-color: #1A1F24;
        outline: none;
    }

    .value::before {
        content: "";
        position: absolute;
        top: 5px;
        left: -10px;
        width: 5px;
        height: 80%;
        background-color: #2F81F7;
        border-radius: 5px;
        opacity: 0;
    }

    .value:focus::before,
    .value:active::before {
        opacity: 1;
    }

    .value svg {
        width: 15px
    }`;

export default Radio;
