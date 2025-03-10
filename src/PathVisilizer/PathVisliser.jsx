//import modules
import styled from "styled-components";
import Constants from "./constants.js";
import {getTwoUniqueRandomNumbers , startRust} from "../HelperFunctions.js";
import {useState , useEffect} from "react";

//import Components
import Node from "./Node.jsx";
import Nav from "./Components/Navbar.jsx";
import Loading from "./Components/Loading.jsx";

//import Rust
import * as Rust from "../../wasm_pkg/RUST.js"

// Set no of rows and columns that would fit the screen
const Columns = Math.floor(window.innerWidth / Constants.nodeWidth);
const Rows = Math.floor(window.innerHeight / Constants.nodeHeight);

//The main component
export default function PathVisualizer() {
    const [cellState, setCellState] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [mouseDown, setMouseDown] = useState(false);

    //Global initialization for rust
    useEffect(() => {
        async function initialize() {
            await startRust();
            const buffer = Rust.create_cell_state_buffer(Rows * Columns);
            setCellState(buffer);
            setInitialized(true);
        }
        initialize().then(()=>console.log("Initializing..."));
    }, []);

    //Function to toggle a node into wall
    // flag 1 means set state 1 flag 0 means set state 0
    function setWall(idx,flag) {
        if (!cellState || idx >= Rows * Columns) {return}
        cellState[idx] = flag;
        Rust.show_buffer();
    }

    function handleDijkstra() {
        let currentCellState = Rust.get_buffer_copy();
        let pathData = Rust.handle_dijkstra(start, end, Rows, Columns);
        // Parse the path data based on the format [noOfVisitedNodes, idx, idx, ..., noOfNodesInShortestPath, idx, idx, ...]
        const noOfVisitedNodes = pathData[0];
        const visitedNodes = pathData.slice(1, noOfVisitedNodes + 1);
        const noOfShortestPathNodes = pathData[noOfVisitedNodes + 1];
        const shortestPathNodes = pathData.slice(noOfVisitedNodes + 2, noOfVisitedNodes + 2 + noOfShortestPathNodes);
        const finalCellState = new Uint8Array(currentCellState);
        animatePath(currentCellState, visitedNodes, shortestPathNodes, finalCellState);
        const totalAnimationTime = (visitedNodes.length * 20) + (shortestPathNodes.length * 50);
        setTimeout(() => {
            setCellState(finalCellState);
        }, totalAnimationTime + 50); //  a small buffer
    }


    //Default function to handle update animation
    //Does not account for CSS animation
    function animatePath(initialCellState, visitedNodes, pathNodes, finalState) {
        let currentCellState = new Uint8Array(initialCellState);
        let previousNodeIdx = null;

        // Animate visited nodes first
        for (let i = 0; i < visitedNodes.length; i++) {
            setTimeout(() => {
                const animationState = new Uint8Array(currentCellState);
                const idx = visitedNodes[i];

                // Change the previous "current" node to regular visited state
                if (previousNodeIdx !== null) {
                    animationState[previousNodeIdx] = 2;
                    finalState[previousNodeIdx] = 2;
                }
                animationState[idx] = 4;
                finalState[idx] = 2;
                previousNodeIdx = idx;
                currentCellState = animationState;
                setCellState(animationState);
            }, i * Constants.visitedAnimationTimeOut);
        }
        if (visitedNodes.length > 0) {
            setTimeout(() => {
                const lastIdx = visitedNodes[visitedNodes.length - 1];
                const animationState = new Uint8Array(currentCellState);
                animationState[lastIdx] = 2;
                currentCellState = animationState;
                setCellState(animationState);
            }, visitedNodes.length * Constants.visitedAnimationTimeOut);
        }

        // Then animate shortest path nodes
        let previousPathIdx = null;
        for (let i = 0; i < pathNodes.length; i++) {
            setTimeout(() => {
                const animationState = new Uint8Array(currentCellState);
                const idx = pathNodes[i];
                if (previousPathIdx !== null) {
                    animationState[previousPathIdx] = 3;
                    finalState[previousPathIdx] = 3;
                }
                animationState[idx] = 4;
                finalState[idx] = 3;
                previousPathIdx = idx;
                currentCellState = animationState;
                setCellState(animationState);
            }, (visitedNodes.length * Constants.visitedAnimationTimeOut) +
                (i * Constants.pathAnimationTimeOut));
        }

        // Set the final path node to state 3 after all path animations
        if (pathNodes.length > 0) {
            setTimeout(() => {
                const lastIdx = pathNodes[pathNodes.length - 1];
                const animationState = new Uint8Array(currentCellState);
                animationState[lastIdx] = 3;
                currentCellState = animationState;
                setCellState(animationState);
            }, (visitedNodes.length * Constants.visitedAnimationTimeOut) +
                (pathNodes.length * Constants.pathAnimationTimeOut));
        }
    }

    // get random indexes for start and end
    const idxes = getTwoUniqueRandomNumbers(Rows * Columns - 1);
    const [start, setStart] = useState(idxes[0]); 
    const [end, setEnd] = useState(idxes[1]);

    //Creating the Grid
    const renderGrid = () => {
        let Cells = [];

        if (!initialized) {
            return <div className="Loading"><Loading/></div>;
        }

        for (let i = 0; i < Rows; i++) {
            for (let j = 0; j < Columns; j++) {
                const currentCellIdx = Columns * i + j;
                let cell = <Node
                    key={currentCellIdx.toString()}
                    idx={currentCellIdx}
                    setWall={setWall}
                    stateValue={cellState?cellState[currentCellIdx]:0}
                    isStart={currentCellIdx === start}
                    isEnd={currentCellIdx === end}
                    mouseIsPressed={mouseDown}
                    onMouseDown={setMouseDown}
                />
                Cells.push(cell);
            }
        }
        return Cells;
    };



    return (
        <>
            <StyledDiv>
                <div className="NavContainer" ><Nav
                    handlePlay = {handleDijkstra}
                /></div>
                <div className="gridContainer">
                    {renderGrid()}
                </div>
            </StyledDiv>
        </>
    );
}


//styling
const StyledDiv = styled.div`
    .NavContainer{
        display: flex;
        position: absolute;
        left: 35%;
        width: auto;
        height: 5vh;
        justify-content: center;
        align-items: center;
        z-index: 99;
        opacity: 0.2;
        transition: 0.2s ease-out;
    },
    .NavContainer:hover{
        transition: 0.2s ease-in;
        opacity: 1;
    },
    .gridContainer {
        background-color: ${Constants.BackgroundColor};
        display: grid;
        grid-template-columns: repeat(${Columns}, 3fr);
        gap: 0;
        width: 100%;
        border: 1px solid black;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        overflow: hidden;
    },
    .Loading{
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;