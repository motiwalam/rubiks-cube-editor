import React from "react";
import Draggable from 'react-draggable';

const MoveInput = (props) => {
    const instructTurn = (e) => {
        if(e.key==='Enter'){
            props.algorithm(document.getElementById('moveInput').value,'Custom');
        }
        e.stopPropagation();
    };

    return (
        <div style={{position: "absolute", zIndex: "99"}}>
            <Draggable
                handle=".handle"
                defaultPosition={{x:window.innerWidth-211 , y: 100}}
                position={null}
                grid={[50, 50]}
                scale={1}
                onStart={props.handleStart}
                onDrag={props.handleDrag}
                onStop={props.handleStop}>
                <div>
                    <div className="handle">Drag from here</div>
                    <div>
                        <input placeholder="type moves here" id="moveInput" onKeyDown={instructTurn}></input>
                        <button id="moveSubmit" onClick={() => props.algorithm(document.getElementById('moveInput').value,'Custom')}>Enter</button>
                    </div>
                </div>
            </Draggable>
        </div>
    );
    };

export default MoveInput;