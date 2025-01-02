import React, {useState} from "react";
import {Row, Col} from "react-bootstrap";
import ColorButton from "./ColorButton";
import "./ColorPicker.css";
import ColorPickerUIFunctions from "./ColorPickerUIFunctions";
import cube from '../../cubeFunctions/cube';
import useLocalStorage from "../../hooks/useLocalStorage";



const ColorPicker = (props) => {
    const [cubeDescBtnText,setCubeDescBtnText] = useState("Get cube description");
    const [resetBtnText,setResetBtnText] = useState("Reset");
    const [presets, setPresets] = useLocalStorage("cube-explorer-presets", {});

    const colors = ["white", "blue","red","yellow","orange","green", "grey"];

    const onCubeDescBtnClick = () => {
        const desc = ColorPickerUIFunctions.cubeDefinitionString(props.state);
        navigator.clipboard.writeText(desc);
        // alert(ColorPickerUIFunctions.cubeDefinitionString(props.state));
        // setSolveBtnText("Configuring...");
        // setTimeout(function(){
        //     document.querySelector(".warningPopup").style.display = "none";
        //     document.querySelector(".bottomExitDiv").style.visibility="visible";
        //     props.setColorPickedCube();
        // }, 100);  
    };

    const onGenerate = () => {
        const desc = ColorPickerUIFunctions.cubeDefinitionString(props.state);

        ColorPickerUIFunctions.computeGenerator(desc).then(gen => {
            if (gen.toLowerCase().includes('fail')) {
                props.setState({cpErrors: gen.split('\n')})
            } else {
                props.setState({
                    cpErrors: gen.split(' ').map((x,i) => `${i+1}. ${x}`)
                });
            }
            // props.setState({cpErrors: [
            //     ...`\nGenerator:\n${gen}`.split('\n')
            // ]});
            // alert(`Desc: ${desc}\n\nGenerator: ${gen}`)
        });
    }

    const onResetClick = () => {
        console.log('calling reset in side color picker');
        let cD = props.state.cubeDimension;
        const blank = [...cube.generateBlank(cD,cD,cD)];
        props.setState({rubiksObject: blank, cpErrors: []},()=>{
            props.reloadCube('cp');
        });
    };

    const onEmptyClick = () => {
        const emptyCube = ColorPickerUIFunctions.emptyCube(props.state);
        props.setState({rubiksObject: emptyCube, cpErrors: []}, () => {
            props.reloadCube('cp');
        });
    }

    function leave(){
        props.endColorPicker();

        if( document.querySelector(".activeMenu")){
            document.querySelector(".activeMenu").classList.remove("activeMenu");
        }

        if(document.querySelector("#cpChangeData").data){
            let data = document.querySelector("#cpChangeData").data.split(",");
            if(data[0]==="Solver") {
                props.setState({activeMenu:"",currentFunct:"None",isValidConfig:false});
                document.querySelector("#cpChangeData").data="";
                return;
            }
            document.querySelector(`#${data[0]}`).classList.add("activeMenu");
            document.querySelector("#cpChangeData").data="";

            props.setState({activeMenu:data[0],currentFunc:data[1],isValidConfig:false},()=>props.beginSolve());
        }
        else{
            props.setState({activeMenu:"",currentFunct:"None",isValidConfig:false});
        }
    }
    function stay(){
        document.querySelector(".warningPopup").style.display="none";
        document.querySelector(".colorButtonContainer").style.visibility="visible";
    }

    function optionClick(e){
        document.querySelector(".warningPopup").style.display="block";
        document.querySelector(".warningPopup").style.width="100%";
        document.querySelector(".colorButtonContainer").style.visibility="hidden";
    }

    return (
        <Row className="cp-container" style={{height:"98%",width:"100%", overflowX:"hidden!important",overflowY:"hidden!important",margin:"0px"}}>
            <Col>
                <div className="cpInfo">
                        <div className="solveCpDiv"><button className="solveCp" onClick={()=>onCubeDescBtnClick()}>
                            <strong style={{color:'green',fontSize:'1rem'}}>{cubeDescBtnText}</strong>
                        </button></div>
                        <div className="checkCpDiv"><button className="checkCp" onClick={()=>onGenerate()}>
                            <strong style={{color:'white',fontSize:'1rem'}}>Generate</strong>
                        </button></div>
                        
                        <div className="checkCpDiv"><button className="checkCp" onClick={()=>onResetClick()}>
                            <strong style={{color:'blue',fontSize:'1rem'}}>{resetBtnText}</strong>
                        </button></div>
                        <div className="checkCpDiv"><button className="checkCp" onClick={()=>onEmptyClick()}>
                            <strong style={{color:'red',fontSize:'1rem'}}>Empty</strong>
                        </button></div>
                        <div style={{position: 'fixed', left: 0, top: '10vh', color: 'white', fontSize: '0.75rem', overflowY: 'scroll', textAlign: 'left'}}>
                        {props.state.cpErrors.map((error,i)=>
                            <p style={{margin: 0}}>{error}</p>
                        )}
                    </div> 
                    {/* {
                        props.isValidConfig?
                        <div className="solveCpDiv"><button className="solveCp" onClick={()=>onSolveClick()}>
                            <strong style={{color:'green',fontSize:'1rem'}}>{solveBtnText}</strong>
                        </button></div>:!props.cpErrors.length?
                        <div className="checkCpDiv"><button className="checkCp" onClick={()=>onCheckClick()}>
                            <strong style={{color:'blue',fontSize:'1rem'}}>{checkBtnText}</strong>
                        </button></div>:[]
                    }
                    <div style={{fontSize:".5rem"}}>
                        {props.state.cpErrors.map((error,i)=>
                            <p key={i} className="cpErrorMessage">{"- "+error}</p>
                        )}
                    </div> */
                    }
                </div>
            </Col>
            <Col style={{padding:"0px"}}>
                <div className="warningPopup">
                    <div id="cpChangeData" data=""></div>
                    {props.isMobile?
                        <div className="cpMessage">Progress will not be saved.</div>:
                        <div className="cpMessage">Are you sure you want to leave Color Picker? Progress will not be saved.</div>}
                    <button onClick={stay} className="cpLeaveStay">Stay</button><button onClick={leave} className="cpLeaveStay">Leave</button>
                </div>
                <div className="colorButtonContainer">
                    
                    {colors.map((color,i)=><ColorButton
                        index={i+1} 
                        // key={color}
                        color={color}
                        colorPicked={props.colorPicked}
                        changeColor={props.changeColor}
                        isMobile={props.isMobile}
                        height={25}
                    />)}
                    <div className="colorButtonDiv" style={{paddingBottom:"0px",width:"100%"}}>
                        <button id="ColorPicker" data="Color Picker" onClick={optionClick} className="colorPicker activeMenu colorPickerExit">Exit</button>
                    </div>
                </div>
            </Col>
        </Row>
        );

};

export default ColorPicker;