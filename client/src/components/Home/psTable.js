import React, { Component } from 'react';
import './psTable.css';
// import { makeStyles } from '@material-ui/core/styles';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';
// import ReactHTMLTableToExcel from 'react-html-table-to-excel';
// import { Button } from '@material-ui/core';
// import { border } from '@material-ui/system';
import JulyPS from '../../constants/julyPS.json';
import AprilPS from '../../constants/aprilPS.json';
import NovPS from '../../constants/novPS.json';
import aprilID from '../../constants/aprilNum.json';
import julyID from '../../constants/julyNum.json';
import novID from '../../constants/novNum.json';
import Trimesters from '../../constants/trimesters.json';

const intakeMonths = Trimesters;

// const useStyles = makeStyles({
//   table: {
//     minWidth: 650,
//   },
// });
export default class PSTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            triMonth: [],
            triYear: [],
            triNum: [],
            intakeNum: null
        }
    }

    componentDidMount() {
        this.updateTrimester(this.props.intake, parseInt(this.props.year));
        this.updateTable(this.props.intake);
    }

    updateTrimester(inputIntake, inputYear) {
        var triName = [];
        // 0 - APRIL
        // 1 - JULY
        // 2 - NOVEMBER
        var initNum = intakeMonths.indexOf(inputIntake);
        this.setState({intakeNum: initNum});
        for(var i = initNum; triName.length < 9; i++){
            triName.push(intakeMonths[i]);
            if (i === intakeMonths.length - 1)
                i = -1;
        }

        var triYear = [];
        for(var j = 0, y = 0; triYear.length < 9;){
            triYear.push(inputYear + y);
            j++;
            if(triName[j] === "July") 
                y++;
        }

        var n = 0;
        switch(initNum) {
            // APRIL
            case 0: 
                n = 3;
                document.getElementById("145").setAttribute("rowSpan", 14);
                document.getElementById("145").innerText = "TPT2201	Industrial Training";
                document.getElementById("146").setAttribute("rowSpan", 14);
                document.getElementById("146").innerText = 4;
                break;
            // JULY
            case 1:
                n = 1;
                document.getElementById("121").setAttribute("rowSpan", 14);
                document.getElementById("121").innerText = "TPT2201	Industrial Training";
                document.getElementById("122").setAttribute("rowSpan", 14);
                document.getElementById("122").innerText = 4;
                break;
            // NOVEMBER
            case 2:
                n = 2;
                document.getElementById("169").setAttribute("rowSpan", 14);
                document.getElementById("169").innerText = "TPT2201	Industrial Training";
                document.getElementById("170").setAttribute("rowSpan", 14);
                document.getElementById("170").innerText = 4;
                break;
            default: 
                n = 1;
                document.getElementById("121").setAttribute("rowSpan", 14);
                document.getElementById("121").innerText = "TPT2201	Industrial Training";
                document.getElementById("122").setAttribute("rowSpan", 14);
                document.getElementById("122").innerText = 4;
                break;
        }
        let triArray = [];
        for(let i = 0; i < 9; i++) {
            triArray.push(n++);
            if(n === 4) n = 1;
        }

        this.setState({
            triMonth: triName, 
            triYear: triYear, 
            triNum: triArray
        });
    }

    updateTable = (intake) => {
        var initNum = intakeMonths.indexOf(intake);
        let psArr = (initNum === 0)
                        ? AprilPS
                        : (initNum === 1)
                            ? JulyPS
                            : NovPS;
        for(let i = 0; i < psArr.length; i++) {
            console.log(i);
            console.log(psArr[i].key);
            console.log(document.getElementById(psArr[i].key));
            if(initNum !== 0 && ((psArr[i].key >= 153 && psArr[i].key <= 161) || (psArr[i].key >= 177 && psArr[i].key <= 185) || (psArr[i].key >= 201 && psArr[i].key <= 209))) {
                if(document.getElementById(psArr[i].key - 24)) {
                document.getElementById((psArr[i].key) - 24).innerText = psArr[i].code + " " + psArr[i].subject;
                document.getElementById((psArr[i].key) - 23).innerText = psArr[i].ch;
                }
            } else {
                if(document.getElementById(psArr[i].key)) {
                    document.getElementById(psArr[i].key).innerText = psArr[i].code + " " + psArr[i].subject;
                    document.getElementById(psArr[i].key + 1).innerText = psArr[i].ch;
                }
            }
        }
    }

    render() {
        // const jsonTable = () => {
        //     const dbParam = JSON.stringify({table:"customers",limit:20});   
        //     const xmlhttp = new XMLHttpRequest();
        //     const myObj = JSON.parse(this.responseText);
        //     let text = "<table border='1' id='ps-table'>"
        //     text += "<tr><th colSpan={2} rowSpan={3}></th>";
        //     text += "<th colSpan={6}>Beta Level</th><th colSpan={6}>Gamma Level</th><th colSpan={6}>Delta Level</th></tr>";
        //     text += "</table>";
        //     document.getElementById("demo").innerHTML = text;
        // }
        return (
            <div>
                {/* <div id="demo">{jsonTable()}</div> */}
                <table id="ps-table">
                    <thead>
                        <tr>
                            <th colSpan={2} rowSpan={3}></th>
                            <th colSpan={6}>Beta Level</th>
                            <th colSpan={6}>Gamma Level</th>
                            <th colSpan={6}>Delta Level</th>
                        </tr>
                        <tr>
                            {this.state.triNum.map((item, index) => {
                                return <th colSpan={2}>{this.state.triMonth[index]} {this.state.triYear[index]}</th>    
                            })}
                        </tr>
                        <tr>
                            {this.state.triNum.map((item, index) => {
                                return <><th>{"Trimester " + item}</th><th>CH</th></>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={2} rowSpan={5}>Core</td>
                        </tr>
                        <tr>
                            {aprilID[0].map((item, index) => {
                                return <td id={item}></td>
                            })}
                        </tr>
                        <tr>
                            {(this.state.intakeNum === 0) ?
                                aprilID[1].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : (this.state.intakeNum === 1) ?
                                julyID[1].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : novID[1].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            }
                        </tr>
                        <tr>
                            {(this.state.intakeNum === 0) ?
                                aprilID[2].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : (this.state.intakeNum === 1) ?
                                julyID[2].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : novID[2].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            }
                        </tr>
                        <tr>
                            {(this.state.intakeNum === 0) ?
                                aprilID[3].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : (this.state.intakeNum === 1) ?
                                julyID[3].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : novID[3].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            }
                        </tr>
                        <tr>
                            <td rowSpan={5}>Specialization</td>
                            <td rowSpan={4}>Core</td>
                        </tr>
                        <tr>
                            {(this.state.intakeNum === 0) ?
                                aprilID[4].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : (this.state.intakeNum === 1) ?
                                julyID[4].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : novID[4].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            }
                        </tr>
                        <tr>
                            {(this.state.intakeNum === 0) ?
                                aprilID[5].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : (this.state.intakeNum === 1) ?
                                julyID[5].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : novID[5].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            }
                        </tr>
                        <tr>
                            {(this.state.intakeNum === 0) ?
                                aprilID[6].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : (this.state.intakeNum === 1) ?
                                julyID[6].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : novID[6].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            }
                        </tr>
                        <tr>
                            <td>Elective</td>
                            {(this.state.intakeNum === 0) ?
                                aprilID[7].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : (this.state.intakeNum === 1) ?
                                julyID[7].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : novID[7].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            }
                        </tr>
                        <tr>
                            <td colSpan={2}>Elective</td>
                            {(this.state.intakeNum === 0) ?
                                aprilID[8].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : (this.state.intakeNum === 1) ?
                                julyID[8].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : novID[8].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            }
                        </tr>
                        <tr>
                            <td colSpan={2} rowSpan={2}>Mata Pelajaran Umum</td>
                            {(this.state.intakeNum === 0) ?
                                aprilID[9].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : (this.state.intakeNum === 1) ?
                                julyID[9].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : novID[9].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            }
                        </tr>
                        <tr>
                            {(this.state.intakeNum === 0) ?
                                aprilID[10].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : (this.state.intakeNum === 1) ?
                                julyID[10].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : novID[10].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            }
                        </tr>
                        <tr>
                            <td colSpan={2}>Compulsory University</td>
                            {(this.state.intakeNum === 0) ?
                                aprilID[11].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : (this.state.intakeNum === 1) ?
                                julyID[11].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            : novID[11].map((item, index) => {
                                    return <td id={item}></td>
                                })
                            }
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}