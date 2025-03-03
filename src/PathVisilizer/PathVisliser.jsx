import styled from "styled-components";
import Constants from "./constants.js";
import Node from "./Node.jsx";
import Nav from "./Components/Navbar.jsx";

const Columns = Math.floor(window.innerWidth / Constants.nodeWidth);
const Rows = Math.floor(window.innerHeight / Constants.nodeHeight);

export default function PathVisualizer() {

    const renderGrid = () => {
        const cells = [];
        for (let i = 0; i < Rows; i++) {
            for (let j = 0; j < Columns; j++) {
                cells.push(
                    <Node
                        key={(Columns * i + j).toString()}
                        idx = {Columns * i + j}
                    />
                );
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