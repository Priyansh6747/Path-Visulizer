//import modules
import styled from "styled-components";
import Constants from "./constants.js";
import {getTwoUniqueRandomNumbers , startRust} from "../HelperFunctions.js";
import {useState , useEffect} from "react";

//import Components
import Node from "./Node.jsx";
import Nav from "./Components/Navbar.jsx";
import Loading from "./Components/Loading.jsx";
import AlgoPicker from "./Components/Card.jsx"

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
    const [AlgoName, setAlgoName] = useState("Dijkstra");
    const [pickerActive, setPickerActive] = useState(false);
    const [speedModifier, setSpeedModifier] = useState(Constants.fastSpeedModifier);

    function getSpeedName() {
        switch(speedModifier) {
            case Constants.fastSpeedModifier :
                return "FAST";
            case Constants.normalSpeedModifier :
                return "NORMAL";
            case Constants.slowSpeedModifier :
                return "SLOW";
        }
    }

    function toggleSpeed() {
        if (speedModifier === Constants.fastSpeedModifier) {
            setSpeedModifier(Constants.slowSpeedModifier);
        }
        if (speedModifier === Constants.normalSpeedModifier) {
            setSpeedModifier(Constants.fastSpeedModifier);
        }
        if (speedModifier === Constants.slowSpeedModifier) {
            setSpeedModifier(Constants.normalSpeedModifier);
        }
    }

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

    function mazify() {
        Rust.gen_maze(start ,end, Columns);
        refreshCells();
    }

    function handlePathfinding(algorithm) {
        let currentCellState = Rust.get_buffer_copy();
        let pathData = algorithm(start, end, Rows, Columns);

        // Parse the path data based on the format [noOfVisitedNodes, idx, idx, ..., noOfNodesInShortestPath, idx, idx, ...]
        const noOfVisitedNodes = pathData[0];
        const visitedNodes = pathData.slice(1, noOfVisitedNodes + 1);
        const noOfShortestPathNodes = pathData[noOfVisitedNodes + 1];
        const shortestPathNodes = pathData.slice(noOfVisitedNodes + 2, noOfVisitedNodes + 2 + noOfShortestPathNodes);

        const finalCellState = new Uint8Array(currentCellState);
        animatePath(currentCellState, visitedNodes, shortestPathNodes, finalCellState);

        const totalAnimationTime = (visitedNodes.length * (Constants.visitedAnimationTimeOut + speedModifier)) + (shortestPathNodes.length * (Constants.pathAnimationTimeOut + speedModifier));
        setTimeout(() => {
            //temp fix for A*
            let BufferRef = Rust.get_buffer_ref();
            for (let i = 0; i < cellState.length; i++) {
                BufferRef[i] = finalCellState[i];
            }
            setCellState(Rust.get_buffer_ref());
        }, totalAnimationTime + 50); // a small buffer
    }

    function handleDijkstra() {
        handlePathfinding(Rust.handle_dijkstra);
    }

    function handleAStar() {
        handlePathfinding(Rust.handle_a_star);
    }
    function handleGreedyBfs() {
        handlePathfinding(Rust.handle_greedy_bfs);
    }
    function handleBfs() {
        handlePathfinding(Rust.handle_bfs);
    }
    function handleDfs() {
        handlePathfinding(Rust.handle_dfs);
    }

    const [algo, setAlgo] = useState(0);
    useEffect(() => {
        switch (algo) {
            case 0:
                setAlgoName("Dijkstra");
                break;
            case 1:
                setAlgoName("A Star")
                break;
            case 2:
                setAlgoName("DFS")
                break;
            case 3:
                setAlgoName("BFS")
                break;
            case 4:
                setAlgoName("Greedy BFS")
                break;
            default:
                setAlgoName("Something");
                break;
        }
    },[algo])
    function playAlgo(){
        setPickerActive(false);
        Rust.reset_non_wall_nodes();
        switch (algo) {
            case 0:
                handleDijkstra();
                break;
            case 1:
                handleAStar();
                break;
            case 2:
                handleDfs();
                break;
            case 3:
                handleBfs();
                break;
            case 4:
                handleGreedyBfs();
                break;
            default:
                break;
        }
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
            }, i * (Constants.visitedAnimationTimeOut + speedModifier));
        }
        if (visitedNodes.length > 0) {
            setTimeout(() => {
                const lastIdx = visitedNodes[visitedNodes.length - 1];
                const animationState = new Uint8Array(currentCellState);
                animationState[lastIdx] = 2;
                currentCellState = animationState;
                setCellState(animationState);
            }, visitedNodes.length * (Constants.visitedAnimationTimeOut + speedModifier));
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
            }, (visitedNodes.length * (Constants.visitedAnimationTimeOut + speedModifier)) +
                (i * (Constants.pathAnimationTimeOut + speedModifier)));
        }

        // Set the final path node to state 3 after all path animations
        if (pathNodes.length > 0) {
            setTimeout(() => {
                const lastIdx = pathNodes[pathNodes.length - 1];
                const animationState = new Uint8Array(currentCellState);
                animationState[lastIdx] = 3;
                currentCellState = animationState;
                setCellState(animationState);
            }, (visitedNodes.length * (Constants.visitedAnimationTimeOut + speedModifier)) +
                (pathNodes.length * (Constants.pathAnimationTimeOut + speedModifier)));
        }
    }





    // get random indexes for start and end
    const idxes = getTwoUniqueRandomNumbers(Rows * Columns - 1);
    const [start, setStart] = useState(idxes[0]); 
    const [end, setEnd] = useState(idxes[1]);

    //Creating the Grid

    const [cellsArray, setCellsArray] = useState([]);

    // Use useEffect to handle the grid initialization
    useEffect(() => {
        if (initialized) {
            renderGrid();
        }
    }, [initialized, cellState, start, end, mouseDown]);

    const renderGrid = () => {
        let cells = [];

        for (let i = 0; i < Rows; i++) {
            for (let j = 0; j < Columns; j++) {
                const currentCellIdx = Columns * i + j;
                let cell = <Node
                    key={currentCellIdx.toString()}
                    idx={currentCellIdx}
                    setWall={setWall}
                    stateValue={cellState ? cellState[currentCellIdx] : 0}
                    isStart={currentCellIdx === start}
                    isEnd={currentCellIdx === end}
                    mouseIsPressed={mouseDown}
                    onMouseDown={setMouseDown}
                />
                cells.push(cell);
            }
        }
        setCellsArray(cells);
    };

    function refreshCells() {
        renderGrid();
    }

    return (
        <>
            <StyledDiv>
                <div className="NavContainer">
                    <Nav
                        handlePlay={playAlgo}
                        AlgoName = {AlgoName}
                        EnablePicker = {setPickerActive}
                        toggleSpeed = {toggleSpeed}
                        speed = {getSpeedName}
                        maze={mazify}
                        refresh={refreshCells}
                    />
                </div>
                {pickerActive? (<div className="algoPicker">
                    <AlgoPicker changeFlag={setAlgo} Enable = {setPickerActive} />
                </div>): null}
                <div className="gridContainer">
                    {!initialized ? (
                        <div className="Loading"><Loading/></div>
                    ) : (
                        cellsArray
                    )}
                </div>
            </StyledDiv>
        </>
    );
}


//styling
const StyledDiv = styled.div`
    .NavContainer {
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
    .algoPicker {
        display: flex;
        position: absolute;
        right: 0;
        bottom: 8%;
        width: auto;
        height: 5vh;
        justify-content: center;
        align-items: center;
        z-index: 99;
        opacity: 0.7;
        transition: 0.2s ease-out;
    },
    .algoPicker:hover{
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