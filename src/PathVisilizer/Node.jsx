import styled from 'styled-components';
import PropTypes from 'prop-types';
import Constants from './constants.js';
import { useEffect, useState } from "react";

export default function Node(props) {
    // Remove the state for stateValue since we'll use props directly
    const [color, setColor] = useState('transparent');

    useEffect(() => {
        switch (props.stateValue) {
            case 0:
                setColor(Constants.DefaultNodeColor);
                break;
            case 1:
                setColor(Constants.WallNodeColor);
                break;
            case 2:
                setColor(Constants.VisitedNodeColor);
                break;
            case 3:
                setColor(Constants.ShortestNodeColor);
                break;
            default:
                break;
        }
    }, [props.stateValue]); // Update when props change

    function MakeWall() {
        props.setWall(props.idx, (props.stateValue === 1)?0:1);
        setColor((color === Constants.WallNodeColor)?Constants.DefaultNodeColor:Constants.WallNodeColor);
    }

    return (
        <StyledWrapper>
            <div
                className="box"
                style={{ backgroundColor: color }}
                onClick={() => MakeWall()}
            >
                {props.isEnd && <span className="node-symbol end-symbol">E</span>}
                {props.isStart && <span className="node-symbol start-symbol">S</span>}
            </div>
        </StyledWrapper>
    );
}

Node.propTypes = {
    idx: PropTypes.number,
    stateValue: PropTypes.number.isRequired,
    setWall: PropTypes.func.isRequired,
    isEnd: PropTypes.bool.isRequired,
    isStart: PropTypes.bool.isRequired,
};

const StyledWrapper = styled.div`
    .box {
        height: ${Constants.nodeHeight}px;
        width: ${Constants.nodeWidth}px;
        border: 1px solid black;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .box:hover {
        transform: scale(0.8);
    }

    .node-symbol {
        font-weight: bold;
        font-size: 1.2em;
        position: absolute;
        color: black;
        text-shadow: 1px 1px 1px white, -1px -1px 1px white, 1px -1px 1px white, -1px 1px 1px white;
    }

    .end-symbol {
        color: #e74c3c;
        font-weight: bolder;
    }

    .start-symbol {
        color: #f82b2b;
        font-weight: bolder;
    }
`;
