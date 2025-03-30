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
        if (props.dragMode !== null) return;
        if (props.isStart || props.isEnd) return;
        props.setWall(props.idx, (props.stateValue === 1) ? 0 : 1);
        setColor((color === Constants.WallNodeColor) ? Constants.DefaultNodeColor : Constants.WallNodeColor);
    }

    function handleMouseDown() {
        if (props.isStart)
            props.setDragMode('start');
        else if (props.isEnd)
            props.setDragMode('end');
        else
            MakeWall();
        props.onMouseDown(true);
    }

    function handleMouseUp() {
        if (props.dragMode !== null) {
            props.setDragMode(null);
        }
        props.onMouseDown(false);
    }

    function handleMouseEnter() {
        if (props.mouseIsPressed && props.dragMode !== null)
            props.handleNodeDrag(props.idx);
        else if (props.mouseIsPressed && props.dragMode === null)
            MakeWall();
    }

    // cursor style
    const getCursorStyle = () => {
        if (props.dragMode !== null) {
            return 'grabbing';
        } else if (props.isStart || props.isEnd) {
            return 'grab';
        }
        return 'default';
    };

    return (
        <StyledWrapper>
            <div
                className={`box ${props.dragMode !== null ? 'dragging' : ''}`}
                style={{
                    backgroundColor: color,
                    cursor: getCursorStyle()
                }}
                onClick={MakeWall}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseEnter={handleMouseEnter}
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
    dragMode: PropTypes.string,
    setDragMode: PropTypes.func.isRequired,
    handleNodeDrag: PropTypes.func.isRequired
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
