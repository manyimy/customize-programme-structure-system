import React, { Component, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./psTable.css";
import axios from "axios";

require("dotenv").config();

const useStyles = makeStyles((theme) => ({
  container: {
    alignItem: "center",
  },
  table: {
    maxWidth: "50vw"
  }
}));
export default function PSTable(props) {
  const classes = useStyles();

  const [standardPS, setStandardPS] = React.useState([]);
  const [intakeNum, setIntakeNum] = React.useState(null);
  const [selectedPS, setSelectedPS] = React.useState([]);

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     standardPS: [],
  //     intakeNum: null,
  //     selectedPS:[],
  //   };
  // }

  useEffect(() => {
    // console.log(process.env.REACT_APP_API_PATH);
    axios
      .get(process.env.REACT_APP_API_PATH + "/standardPS.json")
      .then((response) => {
        let generatedPS = generateCPS(response.data);          
        
        setSelectedPS(generatedPS);
        setStandardPS(response.data);
      //   this.setState({
      //     selectedPS: generatedPS,
      //     standardPS: response.data
      //   });
      });
    console.log(props.trans);
  }, []);

  /** Function: 
   *  Generate Customized Programme Structure
   */
  const generateCPS = (standard) => {
    let afterPS = [];       // programme structure after removal (temp store)
    for (let i = 0; i < standard.length; i++) {    // loop all intake in standard programme structure
      const element = standard[i];
      if(element.intake === props.intake) {    // if current intake is the selected intake
        console.log(element.PS[props.spec]);  
        console.log(props.trans);

        // for each subjects of the selected specialization and intake
        let x = 0;
        for (let i = 0; i < element.PS[props.spec].length; i++) {
          const subject = element.PS[props.spec][i];
          console.log(subject.code + " " + subject.name);
          console.log(props.trans.includes(subject.code + " " + subject.name));

          // if transferred subjects does not include the current subject, 
          // push into the afterPS array
          if(!props.trans.includes(subject.code + " " + subject.name)) {
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
            {selectedPS.map((item, index) => {
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
    </div>
  );
}