import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import "./psTable.css";
import axios from "axios";

require("dotenv").config();

const useStyles = withStyles((theme) => ({
  container: {
    alignItem: "center",
  },
  table: {
    maxWidth: "50vw"
  }
}));
export default useStyles(
  class PSTable extends Component {
    constructor(props) {
      super(props);
      this.state = {
        standardPS: [],
        intakeNum: null,
        selectedPS:[],
      };
    }

    componentDidMount() {
      // console.log(process.env.REACT_APP_API_PATH);
      axios
        .get(process.env.REACT_APP_API_PATH + "/standardPS.json")
        .then((response) => {
          let generatedPS = this.generateCPS(response.data);          
          
          this.setState({
            selectedPS: generatedPS,
            standardPS: response.data
          });
        });
      console.log(this.props.trans);
    }

    /** Function: 
     *  Generate Customized Programme Structure
     */
    generateCPS(standard) {
      let afterPS = [];       // programme structure after removal (temp store)
      for (let i = 0; i < standard.length; i++) {    // loop all intake in standard programme structure
        const element = standard[i];
        if(element.intake === this.props.intake) {    // if current intake is the selected intake
          console.log(element.PS[this.props.spec]);  
          console.log(this.props.trans);

          // for each subjects of the selected specialization and intake
          let x = 0;
          for (let i = 0; i < element.PS[this.props.spec].length; i++) {
            const subject = element.PS[this.props.spec][i];
            console.log(subject.code + " " + subject.name);
            console.log(this.props.trans.includes(subject.code + " " + subject.name));

            // if transferred subjects does not include the current subject, 
            // push into the afterPS array
            if(!this.props.trans.includes(subject.code + " " + subject.name)) {
              afterPS.push(subject);
              x++;
            }
          }
          console.log(afterPS);
          break;
        }
      }
      return afterPS;
    }

    render() {
      const { classes } = this.props;

      return (
        <div className={classes.container}>
          {[1,2,3].map((yearNum) => {
            return (
              <>
              <h1>Year {yearNum}</h1>
              <table id={"ps-table-y"+yearNum} className={classes.table}>
                <tr>
                  <th style={{padding: "6px 30px", width: "10%"}}>Category</th>
                  <th style={{padding: "6px 30px", width: "20%"}}>Subject Code</th>
                  <th style={{padding: "6px 30px", width: "55%"}}>Subject Name</th>
                  <th style={{padding: "6px 30px", width: "5%"}}>CH</th>
                  <th style={{padding: "6px 30px", width: "10%"}}>Trimester</th>
                </tr>
                {this.state.selectedPS.map((item, index) => {
                  if (item.defaultYear === yearNum) {
                    return (
                      <tr>
                        <td>{item.type}</td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.ch}</td>
                        <td>{item.defaultTri}</td>
                      </tr>
                    );
                  } else {
                    return <></>;
                  }
                })}
              </table>
              </>
            );
          })}
          {/* <h1>Year 1</h1>
          <table id="ps-table-y1" className={classes.table}>
            <tr>
              <th style={{padding: "6px 30px", width: "10%"}}>Category</th>
              <th style={{padding: "6px 30px", width: "20%"}}>Subject Code</th>
              <th style={{padding: "6px 30px", width: "55%"}}>Subject Name</th>
              <th style={{padding: "6px 30px", width: "5%"}}>CH</th>
              <th style={{padding: "6px 30px", width: "10%"}}>Trimester</th>
            </tr>
            {this.state.selectedPS.map((item, index) => {
              if (item.defaultYear === 1) {
                return (
                  <tr>
                    <td>{item.type}</td>
                    <td>{item.code}</td>
                    <td>{item.name}</td>
                    <td>{item.ch}</td>
                    <td>{item.defaultTri}</td>
                  </tr>
                );
              } else {
                return <></>;
              }
            })}
          </table>
          <h1>Year 2</h1>
          <table id="ps-table-y2" className={classes.table}>
            <tr>
              <th style={{padding: "6px 30px", width: "10%"}}>Category</th>
              <th style={{padding: "6px 30px", width: "20%"}}>Subject Code</th>
              <th style={{padding: "6px 30px", width: "55%"}}>Subject Name</th>
              <th style={{padding: "6px 30px", width: "5%"}}>CH</th>
              <th style={{padding: "6px 30px", width: "10%"}}>Trimester</th>
            </tr>
            {this.state.selectedPS.map((item, index) => {
              if (item.defaultYear === 2) {
                return (
                  <tr>
                    <td>{item.type}</td>
                    <td>{item.code}</td>
                    <td>{item.name}</td>
                    <td>{item.ch}</td>
                    <td>{item.defaultTri}</td>
                  </tr>
                );
              } else {
                return <></>;
              }
            })}
          </table>
          <h1>Year 3</h1>
          <table id="ps-table-y3" className={classes.table}>
            <tr>
              <th style={{padding: "6px 30px", width: "10%"}}>Category</th>
              <th style={{padding: "6px 30px", width: "20%"}}>Subject Code</th>
              <th style={{padding: "6px 30px", width: "55%"}}>Subject Name</th>
              <th style={{padding: "6px 30px", width: "5%"}}>CH</th>
              <th style={{padding: "6px 30px", width: "10%"}}>Trimester</th>
            </tr>
            {this.state.selectedPS.map((item, index) => {
              if (item.defaultYear === 3) {
                return (
                  <tr>
                    <td>{item.type}</td>
                    <td>{item.code}</td>
                    <td>{item.name}</td>
                    <td>{item.ch}</td>
                    <td>{item.defaultTri}</td>
                  </tr>
                );
              } else {
                return <></>;
              }
            })}
          </table> */}
        </div>
      );
    }
  }
);
