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

export default function PathVisualizer() {
    const [cellState, setCellState] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [mouseDown, setMouseDown] = useState(false);

    useEffect(() => {
        async function initialize() {
            await startRust();
            const buffer = Rust.create_cell_state_buffer(Rows * Columns);
            setCellState(buffer);
            Rust.show_buffer();
            setInitialized(true);
        }
        initialize();
    }, []);

    // flag 1 means set state 1 flag 0 means set state 0
    function setWall(idx,flag) {
        if (!cellState || idx >= Rows * Columns) {return}
        cellState[idx] = flag;
        Rust.show_buffer();
    }

    async function handleDijkstra(){
        await startRust();
        let a =Rust.handle_dijkstra(start,end,Rows,Columns);
        Rust.show_buffer();
        console.log(a);
        setCellState(Rust.get_buffer_copy());
    }

    // get random indexes for start and end
    const idxes = getTwoUniqueRandomNumbers(Rows * Columns - 1);
    const [start, setStart] = useState(idxes[0]); 
    const [end, setEnd] = useState(idxes[1]);

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
                <div className="NavContainer" ><Nav handlePlay = {handleDijkstra} /></div>
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