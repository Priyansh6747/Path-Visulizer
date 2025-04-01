import React from 'react';
import styled from 'styled-components';
import PropTypes from "prop-types";

const Radio = (props) => {

    return (
        <StyledWrapper>
            <div className="input">
                <button className="value">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            fill="white"
                            d="M12 2C6.48 2 2 6.48 2 12c0 4.42 3.58 8 8 8s8-3.58 8-8c0-5.52-4.48-10-8-10zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-9h2v4h-2v-4zm0 6h2v2h-2v-2z"/>
                    </svg>
                    <div className="Data">
                        <p>Name : {props.AlgoName} </p>
                        <p>Visited: {props.visited} ({props.percentage.toFixed(2)}%) </p>
                        <p>Complexity: {props.complexity}</p>
                    </div>
                </button>
            </div>
        </StyledWrapper>
    );
};

Radio.PropTypes = {
    AlgoName: PropTypes.string.isRequired,
    visited: PropTypes.number.isRequired,
    percentage: PropTypes.number,
    complexity: PropTypes.string,
}


const StyledWrapper = styled.div`
    .input {
        display: flex;
        flex-direction: column;
        width: 200px;
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
    }
    
    .Data {
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 7px;
    }
`;

export default Radio;
