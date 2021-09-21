import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
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

const useStyles = withStyles((theme) => ({
  container: {
    alignItem: 'center',
  },
}));
export default useStyles(class PSTable extends Component {
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
        // this.updateTable(this.props.intake);
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
                // document.getElementById("145").setAttribute("rowSpan", 14);
                // document.getElementById("145").innerText = "TPT2201	Industrial Training";
                // document.getElementById("146").setAttribute("rowSpan", 14);
                // document.getElementById("146").innerText = 4;
                break;
            // JULY
            case 1:
                n = 1;
                // document.getElementById("121").setAttribute("rowSpan", 14);
                // document.getElementById("121").innerText = "TPT2201	Industrial Training";
                // document.getElementById("122").setAttribute("rowSpan", 14);
                // document.getElementById("122").innerText = 4;
                break;
            // NOVEMBER
            case 2:
                n = 2;
                // document.getElementById("169").setAttribute("rowSpan", 14);
                // document.getElementById("169").innerText = "TPT2201	Industrial Training";
                // document.getElementById("170").setAttribute("rowSpan", 14);
                // document.getElementById("170").innerText = 4;
                break;
            default: 
                n = 1;
                // document.getElementById("121").setAttribute("rowSpan", 14);
                // document.getElementById("121").innerText = "TPT2201	Industrial Training";
                // document.getElementById("122").setAttribute("rowSpan", 14);
                // document.getElementById("122").innerText = 4;
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
        const { classes } = this.props;
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
            <div className={classes.container}>
                {/* <div id="demo">{jsonTable()}</div> */}
                <h1>Year 1</h1>
                <table id="ps-table">
                    <tr>
                        <th>Category</th>
                        <th>Subject Code</th>
                        <th>Subject Name</th>
                        {/* <th>Year</th> */}
                        <th>Trimester</th>
                    </tr>
                    {(this.state.intakeNum === 0) ?
                        AprilPS.map((item, index) => {
                            if(item.defaultYear === 1) {
                                return (
                                    <>
                                        <tr>
                                            <td>{ item.type }</td>
                                            <td>{ item.code }</td>
                                            <td>{ item.subject }</td>
                                            {/* <td>{ item.defaultYear }</td> */}
                                            <td>{ item.defaultTri }</td>
                                        </tr>
                                    </>
                                );
                            }
                        })
                    : (this.state.intakeNum === 1) ?
                        JulyPS.map((item, index) => {
                            if(item.defaultYear === 1) {
                                return (
                                    <>
                                        <tr>
                                            <td>{ item.type }</td>
                                            <td>{ item.code }</td>
                                            <td>{ item.subject }</td>
                                            {/* <td>{ item.defaultYear }</td> */}
                                            <td>{ item.defaultTri }</td>
                                        </tr>
                                    </>
                                );
                            }
                        })
                    : NovPS.map((item, index) => {
                            if(item.defaultYear === 1) {
                                return (
                                    <>
                                        <tr>
                                            <td>{ item.type }</td>
                                            <td>{ item.code }</td>
                                            <td>{ item.subject }</td>
                                            {/* <td>{ item.defaultYear }</td> */}
                                            <td>{ item.defaultTri }</td>
                                        </tr>
                                    </>
                                );
                            }
                        })
                    }
                </table>
                <h1>Year 2</h1>
                <table id="ps-table">
                    <tr>
                        <th>Category</th>
                        <th>Subject Code</th>
                        <th>Subject Name</th>
                        {/* <th>Year</th> */}
                        <th>Trimester</th>
                    </tr>
                    {(this.state.intakeNum === 0) ?
                        AprilPS.map((item, index) => {
                            if(item.defaultYear === 2) {
                                return (
                                    <>
                                        <tr>
                                            <td>{ item.type }</td>
                                            <td>{ item.code }</td>
                                            <td>{ item.subject }</td>
                                            {/* <td>{ item.defaultYear }</td> */}
                                            <td>{ item.defaultTri }</td>
                                        </tr>
                                    </>
                                );
                            }
                        })
                    : (this.state.intakeNum === 1) ?
                        JulyPS.map((item, index) => {
                            if(item.defaultYear === 2) {
                                return (
                                    <>
                                        <tr>
                                            <td>{ item.type }</td>
                                            <td>{ item.code }</td>
                                            <td>{ item.subject }</td>
                                            {/* <td>{ item.defaultYear }</td> */}
                                            <td>{ item.defaultTri }</td>
                                        </tr>
                                    </>
                                );
                            }
                        })
                    : NovPS.map((item, index) => {
                            if(item.defaultYear === 2) {
                                return (
                                    <>
                                        <tr>
                                            <td>{ item.type }</td>
                                            <td>{ item.code }</td>
                                            <td>{ item.subject }</td>
                                            {/* <td>{ item.defaultYear }</td> */}
                                            <td>{ item.defaultTri }</td>
                                        </tr>
                                    </>
                                );
                            }
                        })
                    }
                </table>
                <h1>Year 3</h1>
                <table id="ps-table">
                    <tr>
                        <th>Category</th>
                        <th>Subject Code</th>
                        <th>Subject Name</th>
                        {/* <th>Year</th> */}
                        <th>Trimester</th>
                    </tr>
                    {(this.state.intakeNum === 0) ?
                        AprilPS.map((item, index) => {
                            if(item.defaultYear === 3) {
                                return (
                                    <>
                                        <tr>
                                            <td>{ item.type }</td>
                                            <td>{ item.code }</td>
                                            <td>{ item.subject }</td>
                                            {/* <td>{ item.defaultYear }</td> */}
                                            <td>{ item.defaultTri }</td>
                                        </tr>
                                    </>
                                );
                            }
                        })
                    : (this.state.intakeNum === 1) ?
                        JulyPS.map((item, index) => {
                            if(item.defaultYear === 3) {
                                return (
                                    <>
                                        <tr>
                                            <td>{ item.type }</td>
                                            <td>{ item.code }</td>
                                            <td>{ item.subject }</td>
                                            {/* <td>{ item.defaultYear }</td> */}
                                            <td>{ item.defaultTri }</td>
                                        </tr>
                                    </>
                                );
                            }
                        })
                    : NovPS.map((item, index) => {
                            if(item.defaultYear === 3) {
                                return (
                                    <>
                                        <tr>
                                            <td>{ item.type }</td>
                                            <td>{ item.code }</td>
                                            <td>{ item.subject }</td>
                                            {/* <td>{ item.defaultYear }</td> */}
                                            <td>{ item.defaultTri }</td>
                                        </tr>
                                    </>
                                );
                            }
                        })
                    }
                </table>
            </div>
        );
    }
});