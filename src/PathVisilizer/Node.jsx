import styled from 'styled-components';
import PropTypes from 'prop-types';
import Constants from './constants.js';
import { useEffect, useState } from "react";

export default function Node(props) {
    const [color, setColor] = useState('transparent');

    useEffect(() => {
        const colors = [
            Constants.DefaultNodeColor,
            Constants.WallNodeColor,
            Constants.VisitedNodeColor,
            Constants.ShortestNodeColor,
            Constants.visitingNodeColor
        ];
        const colorIndex = props.stateValue % colors.length;
        setColor(colors[colorIndex]);
    }, [props.stateValue]);

    function MakeWall() {
        if (props.isStart || props.isEnd) {return}
        props.setWall(props.idx, (props.stateValue === 1) ? 0 : 1);
        setColor((color === Constants.WallNodeColor) ? Constants.DefaultNodeColor : Constants.WallNodeColor);
    }

    return (
        <StyledWrapper>
            <div
                className="box"
                style={{ backgroundColor: color }}
                onClick={MakeWall}
                onMouseDown={() => {
                    MakeWall();
                    props.onMouseDown(true);
                }}
                onMouseUp={() => {
                    props.onMouseDown(false);
                }}
                onMouseEnter={() => {
                    if (props.mouseIsPressed) {
                        MakeWall();
                    }
                }}
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
    mouseIsPressed: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired,
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
