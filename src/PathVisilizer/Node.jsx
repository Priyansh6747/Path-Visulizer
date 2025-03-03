import styled from 'styled-components';
import PropTypes from 'prop-types';
import Constants from './constants.js';

export default function Node(props) {

    return (
        <>
            <StyldedWrapper>
                <div className="box" onClick={()=>console.log(`clicked at ${props.idx}`)}></div>
            </StyldedWrapper>
        </>
    )
}
Node.propTypes = {
    idx: PropTypes.number,
}
const StyldedWrapper = styled.div`
    .box {
        height: ${Constants.nodeHeight}px;
        width: ${Constants.nodeWidth}px;
        background-color: transparent;
        border: 1px solid black;
        padding: 0;
        margin: 0;
    }
    .box:hover {
        transform: scale(80%);
    }
`