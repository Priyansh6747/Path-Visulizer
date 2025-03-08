import styled from "styled-components";
import Constants from "./constants.js";
import Node from "./Node.jsx";
import Nav from "./Components/Navbar.jsx";
import {getTwoUniqueRandomNumbers} from "../HelperFunctions.js";
import {useState} from "react";

const Columns = Math.floor(window.innerWidth / Constants.nodeWidth);
const Rows = Math.floor(window.innerHeight / Constants.nodeHeight);

export default function PathVisualizer() {
    let cells = [];
    function wallCell(idx){
        console.log(idx);
    }
    // get random indexes for start and end
    const idxes = getTwoUniqueRandomNumbers(Rows * Columns -1);
    const [start, setStart] = useState(idxes[0]);
    const [end, setEnd] = useState(idxes[1]);
    const renderGrid = () => {

        for (let i = 0; i < Rows; i++) {
            for (let j = 0; j < Columns; j++) {
                const currentCellIdx = Columns * i +j;
                    let cell = <Node
                    key={currentCellIdx.toString()}
                    idx = {currentCellIdx}
                    wallCell={wallCell}
                    stateValue={0}
                    isStart={currentCellIdx === start} isEnd={currentCellIdx === end}
                />
                cells.push(cell);
            }
        }
        return cells;
    };

    return (
        <>
            <StyledDiv>
                <div className="NavContainer"><Nav/></div>
                <div className="gridContainer">
                    {renderGrid()}
                </div>
            </StyledDiv>
        </>
    );
}

const StyledDiv = styled.div`
    .NavContainer{
        display: flex;
        position: absolute;
        width: 100%;
        height: 5vh;
        justify-content: center;
        align-items: center;
        z-index: 99;
    },
    .gridContainer {
        display: grid;
        grid-template-columns: repeat(${Columns}, 3fr);
        gap: 0;
        width: 100%;
        border: 1px solid black;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        overflow: hidden;
    }
`;