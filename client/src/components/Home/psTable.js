import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./psTable.css";
import axios from "axios";

require("dotenv").config();
const API_PATH = process.env.REACT_APP_API_PATH;

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

  // const [intakeNum, setIntakeNum] = useState(null);
  const [selectedPS, setSelectedPS] = useState([]);
  const [standardPS, setStandardPS] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     standardPS: [],
  //     intakeNum: null,
  //     selectedPS:[],
  //   };
  // }

  useEffect(() => {
    axios
      .get(API_PATH + "/subjectList.json")
      .then((res) => {
        setSubjectList(res.data);

        axios
          .get(API_PATH + "/standardPS.json")
          .then((response) => {
            let generatedPS = generateCPS(res.data, response.data);          
            
            setStandardPS(response.data);
            setSelectedPS(generatedPS);
          }).catch((err) => {
            console.log(err);
          });
      }).catch((err) => {
        console.log(err);
      });
    console.log(props.trans);
  }, []);

  /** Function: 
   *  Generate Customized Programme Structure
   */
  const generateCPS = (subList, standard) => {
    let afterPS = [];       // programme structure after removal (temp store)
    for (let i = 0; i < standard.length; i++) {    // loop all intake in standard programme structure
      const element = standard[i];
      if (element.intake === props.intake) {    // if current intake is the selected intake
        console.log(element.PS[props.spec]);  
        console.log(props.trans);

        // for each subjects of the selected specialization and intake
        let index = 0;
        for (let a = 0; a < element.PS[props.spec].length; a++) {
          const subject = element.PS[props.spec][a];
          console.log(subject.code + " " + subject.name);
          console.log(props.trans.includes(subject.code + " " + subject.name));

          // if transferred subjects does not include the current subject, 
          // push into the afterPS array
          if (!props.trans.includes(subject.code + " " + subject.name)) {
            afterPS.push(subject);
            index++;
          }
        }

        /**
         * Logic: 1. get priority of subjects from programme structure after removed,
         *        2. arrange it from high to low in an object array 
         *        3. take subject from the array when the trimester's credit hour is not enough
         */

        /**
         * Step 1: Get priority of all subjects from the PS after removed
         * 
         * - Initialize priorityList with all subjects in afterPS, and set the priority to 0
         * - Check if each subject in subjectList exists in the afterPS/priorityList
         * - if yes, check its prerequisites
         * - if prerequisite subject also exists in priorityList/afterPS, increment the priority value
         * - Arrange the priorityList according to the value in non-increasing order
         *  
         */ 
        var priorityList = new Map(); 
        afterPS.forEach(subj => {
          priorityList.set(subj.code, 0);
          // priorityList.set(subj.code, priorityList.get(subj.code)+1) // this is how you increment the prioriy value
          // priorityList.push(subject);
        });
        console.log(priorityList);
        console.log(subList);

        subList.forEach(subj => {
          console.log(subj);
          if(priorityList.has(subj.code)) { 
            console.log("has " + subj.code);
            subj.prereq.forEach(prereq => {
              if(priorityList.has(prereq)) {
                priorityList.set(prereq, priorityList.get(prereq)+1);
              }
            });
          }
        });

        let sortedList = new Map([...priorityList.entries()].sort((a, b) => b[1] - a[1]));  // sort into non-increasing order
        
        priorityList = new Map(sortedList);
        console.log(priorityList);
        
        // Step 2: Initialize visited and unvisited set
        var visited, unvisited = [];

        // Step 3: loop each trimester to replace and rearrange subjects
        //    - push existed subject of the trimester into visited list
        //    - check if credit hour of the trimester is enough/full
        //    - if not, take the highest priority subject offered to replace


        // console.log(afterPS);
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