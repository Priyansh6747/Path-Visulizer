import styled from 'styled-components';
import PropTypes from 'prop-types';
import Constants from './constants.js';
import { useEffect, useState } from "react";

export default function Node(props) {
    const [state, setState] = useState(props.stateValue);
    const [color, setColor] = useState('transparent');

    useEffect(() => {
        switch (state) {
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
    }, [state]);

    function MakeWall(){
        if (state === 1 ) {
            props.setWall(props.idx , 0);
            setState(0)
        }else if (!props.isStart && !props.isEnd){
            props.setWall(props.idx , 1);
            setState(1)
        }
    }

    return (
        <StyledWrapper>
            <div
                className="box"
                style={{ backgroundColor: color }}
                onClick={() => MakeWall()}
            >
                {props.isEnd && <span className="node-symbol end-symbol">X</span>}
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
        color: #c1dc0f;
        font-weight: bolder;
    }
`;
