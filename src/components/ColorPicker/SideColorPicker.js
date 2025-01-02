import React, {useState} from "react";
import "./ColorPicker.css";
import "../SideView/SideView.css"
import ColorPickerUIFunctions from "./ColorPickerUIFunctions";
import cube from '../../cubeFunctions/cube';
import useLocalStorage from "../../hooks/useLocalStorage";

const URFDLB = ([U, R, F, D, L, B]) => ({U, R, F, D, L, B});

const yellowTopBlueFront = URFDLB(['yellow', 'red', 'blue', 'white', 'orange', 'green'])
const dtoc = ColorPickerUIFunctions.definitionStringToCube;

const defaultPresets = {
    'Cube in a cube': dtoc('RRRRUURUURRFRRFFFFUFFUFFUUULLLDDLDDLBBBLLBLLBDDDDBBDBB', yellowTopBlueFront),
    'Anaconda': dtoc('LLLLUULULFRFFRRFFFDFDFFDDDDRRRDDRRDRBBBBLLBLBUUUBBUUBU', yellowTopBlueFront),
    'Checkerboard': dtoc('UDUDUDUDURLRLRLRLRFBFBFBFBFDUDUDUDUDLRLRLRLRLBFBFBFBFB', yellowTopBlueFront),
}


const SideColorPicker = (props) => {
    const [cubeDescBtnText,setCubeDescBtnText] = useState("Copy cube description");
    const [resetBtnText,setResetBtnText] = useState("Reset");
    const [presets, setPresets] = useLocalStorage("cube-explorer-presets", defaultPresets);

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
        const o = ColorPickerUIFunctions.computeCubeOrientation(props.state);

        ColorPickerUIFunctions.computeGenerator(desc).then(gen => {
            if (gen.toLowerCase().includes('fail')) {
                props.setState({cpErrors: gen.split('\n')})
            } else {
                props.setState({
                    cpErrors: [
                        `Orient the cube with ${o.U} on top, ${o.F} in front, and ${o.L} on the left.`,
                        ...gen.split(' ').map((x,i) => `${i+1}. ${x}`)
                    ]
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
    
    return (
        <div className="sideMenuBox0 sideLimit">
          <div className="sideMenuBox1">
            <div className="cpInfo" style={{width:"100%"}}>
                    <div className="solveCpDiv" style={{paddingTop: 0}}><button className="solveCp" onClick={()=>onCubeDescBtnClick()}>
                            <strong style={{color:'white',fontSize:'1rem'}}>{cubeDescBtnText}</strong>
                        </button></div>

                        <div className="checkCpDiv"><button className="checkCp" onClick={()=>onGenerate()}>
                            <strong style={{color:'white',fontSize:'1rem'}}>Generate</strong>
                        </button></div>
                        
                        <div className="checkCpDiv"><button className="checkCp" onClick={()=>onResetClick()}>
                            <strong style={{color:'white',fontSize:'1rem'}}>{resetBtnText}</strong>
                        </button></div>
                        <div className="checkCpDiv"><button className="checkCp" onClick={()=>onEmptyClick()}>
                            <strong style={{color:'white',fontSize:'1rem'}}>Empty</strong>
                        </button></div>

                        <div className="checkCpDiv"><button className="checkCp" onClick={()=>{
                            const presetName = prompt('Name for preset:');
                            if (presetName === null) return;
                            setPresets(p => ({...p, [presetName]: props.state.rubiksObject.map(r => [...r]) }))
                        }}>
                            <strong style={{color:'white',fontSize:'1rem'}}>Save preset</strong>
                        </button></div>
                        
                        <div className="checkCpDiv">
                            <select key={Object.keys(presets).length} className="checkCp" name="presetSelect" style={{color: 'white', fontSize: '1rem'}}>
                                <option selected disabled>Choose preset</option>
                                {
                                    Object.keys(presets).map(k => {
                                        const cb = () => {
                                            props.setState({rubiksObject: presets[k], cpErrors: []}, () => {
                                                props.reloadCube('cp');
                                            });
                                            // console.log('clicked preset ' + k);
                                        }
                                        return (
                                            <option name={k} value={k} onClick={cb}>
                                                {k}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        <div className="checkCpDiv">
                            <select key={Object.keys(presets).length} className="checkCp" name="presetSelect" style={{color: 'white', fontSize: '1rem'}}>
                                <option selected disabled>Delete preset</option>
                                {
                                    Object.keys(presets).map(k => {
                                        const cb = () => {
                                            setPresets(p => {
                                                const copy = {...p};
                                                delete copy[k];
                                                return copy;
                                            })
                                            // console.log('deleted preset ' + k);
                                        }
                                        return (
                                            <option name={k} value={k} onClick={cb}>
                                                {k}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                            
                    {/* {
                        props.isValidConfig?
                        <div className="solveCpDiv"><button className="solveCp" onClick={onSolveClick}>
                            <strong style={{color:'green',fontSize:'1rem'}}>{solveBtnText}</strong>
                        </button></div>:!props.cpErrors.length?
                        <div className="checkCpDiv"><button className="checkCp" onClick={onCheckClick}>
                            <strong style={{color:'blue',fontSize:'1rem'}}>{checkBtnText}</strong>
                        </button></div>:[]
                    } */
                //    <pre style={{ color: 'red', overflowX: 'scroll' }} >
                //     {props.state.cpErrors.join('\n')}
                //    </pre>
                    <div style={{position: 'fixed', left: 0, top: '10vh', color: 'white', fontSize: '0.75rem', overflowY: 'scroll', textAlign: 'left'}}>
                        {props.state.cpErrors.map((error,i)=>
                            <p style={{margin: 0}}>{error}</p>
                        )}
                    </div> 
                    }
                </div>   
            </div>  
        </div>        
    );
};

export default SideColorPicker;