import React from 'react';
import styled from 'styled-components';
import PropTypes from "prop-types";
import {startRust} from "./../../HelperFunctions.js"
import {clear_shared_buffer} from "./../../../wasm_pkg/RUST.js"

const Radio = (props) => {
    async function clear(){
        await startRust();
        clear_shared_buffer();
        props.refresh();
        props.setisPlayed(false);
    }

    function handleClick(e){
        e.preventDefault();
        props.toggleSpeed();
    }
    return (
        <StyledWrapper>
            <div className="input">
                <button className="value" onClick={props.handlePlay}>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#7D8590" d="M8 5v14l11-7z"/>
                    </svg>
                    Play
                </button>
                <button className="value" onClick={()=>props.EnablePicker(true)}>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#7D8590" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                    </svg>
                    {props.AlgoName}
                </button>
                <button className="value" onClick = {handleClick}>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#7D8590" d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/>
                    </svg>
                    Speed {props.speed()}
                </button>
                <button className="value" onClick={props.maze}>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#7D8590" d="M21 9V5c0-1.1-.9-2-2-2h-4m5 16h-4m-8 0H4c-1.1 0-2-.9-2-2v-4m0-8V5c0-1.1.9-2 2-2h4"/>
                        <path fill="#7D8590" d="M7 12h4v4H7v-4zm6-6h4v4h-4V6z"/>
                    </svg>
                    Maze
                </button>
                <button className="value" onClick={clear}>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#7D8590" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                    Clear
                </button>
            </div>
        </StyledWrapper>
    );
}

Radio.PropTypes = {
    handlePlay: PropTypes.func.isRequired,
    AlgoName: PropTypes.string.isRequired,
    EnablePicker: PropTypes.func.isRequired,
    toggleSpeed: PropTypes.func.isRequired,
    speed: PropTypes.func.isRequired,
    maze: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    setisPlayed: PropTypes.func.isRequired,
}

const StyledWrapper = styled.div`
    .input {
        display: flex;
        flex-direction: row;
        width: fit-content;
        background-color: #0d1117;
        justify-content: center;
        border-radius: 5px;
        gap: 8px;
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
        transition: all 0.2s ease;
    }

    .value:not(:active):hover,
    .value:focus {
        background-color: #21262c;
    }

    .value:focus,
    .value:active {
        background-color: #1a1f24;
        outline: none;
    }

    .value::before {
        content: "";
        position: absolute;
        top: 30px;
        right: 0;
        width: 100%;
        height: 3px;
        background-color: #2f81f7;
        border-radius: 5px;
        opacity: 0;
    }

    .value:focus::before,
    .value:active::before {
        opacity: 1;
    }

    .value svg {
        width: 15px;
    }`;

export default Radio;
