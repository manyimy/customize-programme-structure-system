import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./psTable.css";
import axios from "axios";

require("dotenv").config();
const API_PATH = process.env.REACT_APP_API_PATH;
const MAX_CH = 122;

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
  const [selectedPS, setSelectedPS] = useState(new Map());
  const [standardPS, setStandardPS] = useState([]);
  const [subjectList, setSubjectList] = useState();
  // const [ch2D, setCh2D] = useState([]);

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
        setSubjectList(new Map(res.data));

        axios
          .get(API_PATH + "/standardPS.json")
          .then((response) => {
            let generatedPS = generateCPS(new Map(res.data), response.data);          
            
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
   *    Generate Customized Programme Structure 
   *  Parameters: 
   *    Array[Object] sublist - subjectList from the server
   *    Array[Object] standard - the complete standard programme structure
   */
  const generateCPS = (subList, standard) => {
    let afterTransferPS = new Map();       // programme structure after removal of credit transferred subjects
    let ch2d = []; 
    ch2d.push([0,0,0],[0,0,0],[0,0,0]);
    console.log(ch2d);
    let creditHour = MAX_CH;
    
    for (let i = 0; i < standard.length; i++) {    // loop all intake in standard programme structure
      const element = standard[i];

      /** 
       * Remove credit transferrec subjects
       */
      if (element.intake === props.intake) {    // if current intake is the selected intake
        console.log(element.PS[props.spec]);  
        // console.log(props.trans);

        // if no subject is transferred, return the standard programme structure
        if (props.trans.length === 0) {
          return new Map(element.PS[props.spec]);
        }

        // loop subjects in the selected specialization and intake
        let index = 0;
        for (const [code, val] of element.PS[props.spec]) {
          console.log(code);
          console.log(val);

          // if current subject is not transferred, push into the afterTransferPS array
          if (!props.trans.includes(code + " " + val.name)) {
            afterTransferPS.set(code, val);
            ch2d[val.defaultYear-1][val.defaultTri-1] += val.ch;
            index++;
          } else {
            creditHour -= val.ch;
          }
        }
        console.log(ch2d);
        console.log("current total credit hour : " + creditHour);

        /**
         * Logic: 1. get priority of subjects from programme structure after removed,
         *        2. arrange it from high to low in an object array 
         *        3. take subject from the array when the trimester's credit hour is not enough
         */

        /**
         * Step 1: Get priority of all subjects from the PS after removed
         * 
         * - Initialize priorityList with all subjects in afterTransferPS, and set the priority to 0
         * - Check if each subject in subjectList exists in the afterTransferPS/priorityList
         * - if yes, check its prerequisites
         * - if prerequisite subject also exists in priorityList/afterTransferPS, increment the priority value
         * - Arrange the priorityList according to the value in non-increasing order
         *  
         */ 
        var priorityList = new Map(); 
        for (const [code, subj] of afterTransferPS) {
          /**
           * 1190 to Year 1 Trimester 1 subjects
           * 1290 to Year 1 Trimester 2 subjects
           * 1390 to Year 1 Trimester 3 subjects
           * 2190 to Year 2 Trimester 1 subjects
           */
          priorityList.set(code, subj.defaultYear*1000 + subj.defaultTri*100 + 90);
        }

        console.log(afterTransferPS);
        console.log(priorityList);
        console.log(subList);


        for (const [key, value] of subList) {
          if(priorityList.has(key)) { 
            // console.log("has " + subj.code);

            // if the subject is offered once a year: -40  (xx90 -> xx50)
            if(value.offer.length === 2) {
              priorityList.set(key, priorityList.get(key)-10); 
            }
            value.prereq.forEach(prereq => {
              if(priorityList.has(prereq)) {
                priorityList.set(prereq, priorityList.get(prereq)-10);
              }
            });
          }
        }
        console.log(priorityList);

        let sortedList = new Map([...priorityList.entries()].sort((a, b) => a[1] - b[1]));  // sort into non-decreasing order
        
        priorityList = new Map(sortedList);
        console.log(priorityList);
        
        // Step 2: Initialize visited and toBePlacedSubjects set
        // var visited = [];
        var toBePlacedSubjects = [];    // only contains subjects code
        for (const [code, val] of afterTransferPS) {
          toBePlacedSubjects.push(code);
        }
        console.log(toBePlacedSubjects);    

        // Step 3: loop until all subjects are placed
        //    - remove existed subject of the current trimester from toBePlacedSubjects list
        //    - check if credit hour of the trimester is enough/full
        //    - if not, take the highest priority subject offered to replace
        console.log(afterTransferPS);

        for (let thisYear = 1; thisYear <= 3; thisYear++) {
          for (let thisTri = 1; thisTri <= 3; thisTri++) {

            // remove existed subjects of current trimester from toBePlacedSubjects list
            for (const [code, val] of afterTransferPS) {
              if(val.defaultYear <= thisYear && val.defaultTri <= thisTri && toBePlacedSubjects.includes(code)){
                toBePlacedSubjects.splice(toBePlacedSubjects.indexOf(code), 1);
              }
            }

            console.log(toBePlacedSubjects);

            let maxCHOfTri = (thisTri===3) ? props.shortLimit : props.longLimit;
            var candidateSubject = anyReplaceble(thisYear, thisTri, priorityList, toBePlacedSubjects, subList, ch2d, maxCHOfTri, afterTransferPS);
            console.log("candidateSubject");
            console.log(candidateSubject);
            while(ch2d[thisYear-1][thisTri-1] <= maxCHOfTri && candidateSubject) {

              for (let [code, val] of afterTransferPS) {
                if(code === candidateSubject) {
                  console.log("replaced " + code);
                  console.log(val);
                  ch2d[val.defaultYear-1][val.defaultTri-1] -= val.ch;
                  val.defaultTri = thisTri;
                  val.defaultYear = thisYear;
                  ch2d[thisYear-1][thisTri-1] += val.ch;
                  toBePlacedSubjects.splice(toBePlacedSubjects.indexOf(candidateSubject), 1);
                  break;
                }
              }
              // for (let num = 0; num < afterTransferPS.length; num++) {
              //   const toReplace = afterTransferPS[num];
              //   if(toReplace.code === candidateSubject) {
              //     console.log("replaced " + afterTransferPS[num].code);
              //     console.log(afterTransferPS[num]);
              //     ch2d[afterTransferPS[num].defaultYear-1][afterTransferPS[num].defaultTri-1] -= afterTransferPS[num].ch;
              //     afterTransferPS[num].defaultTri = thisTri;
              //     afterTransferPS[num].defaultYear = thisYear;
              //     ch2d[thisYear-1][thisTri-1] += afterTransferPS[num].ch;
              //     toBePlacedSubjects.splice(toBePlacedSubjects.indexOf(candidateSubject), 1);
              //     break;
              //   }
              // }
              candidateSubject = anyReplaceble(thisYear, thisTri, priorityList, toBePlacedSubjects, subList, ch2d, maxCHOfTri, afterTransferPS);
              console.log("candidateSubject");
              console.log(candidateSubject);
            }
            console.log(ch2d[thisYear-1][thisTri-1]);
          }
        }
        break;
      }
    }
    console.log(afterTransferPS);
    return sortPSMap(afterTransferPS);
  }

  // check if any subject can be replaced
  const anyReplaceble = (thisYear, thisTri, priorityList, toBePlacedSubjects, subList, ch2d, maxCHOfTri, afterTransferPS) => {
    console.log(toBePlacedSubjects);
    for (let index = 0; index < Array.from(priorityList.keys()).length; index++) {
      const prioritySubjectCode = Array.from(priorityList.keys())[index];
      if(subList.get(prioritySubjectCode) && toBePlacedSubjects.includes(prioritySubjectCode) && subList.get(prioritySubjectCode).offer.includes(thisTri) && 
          ch2d[thisYear-1][thisTri-1] + subList.get(prioritySubjectCode).ch <= maxCHOfTri && meetPrerequisite(prioritySubjectCode, thisYear, thisTri, afterTransferPS, subList, ch2d)) {
          // && !toBePlacedSubjects.some( ai => subList.get(prioritySubjectCode).prereq.includes(ai) )) {    // check if prerequisite has been taken
        console.log(prioritySubjectCode);
        return prioritySubjectCode;
      }
    }
    return null;
  }

  const sortPSMap = (toSortPS) => {
    let sortedPS = new Map();
    for (let y = 1; y <= 3; y++) {
      for (let t = 1; t <= 3; t++) {
        for (let [code, val] of toSortPS) {
          if(val.defaultYear===y && val.defaultTri===t) {
            sortedPS.set(code, val);
          }
        }
      } 
    }
    return sortedPS;
  }

  /**
   * Check if the subject meets the prerequisite requirements
   * special requirements:
   *  - fyp: 50 credit hours
   *  - industrial training: 60 credit hours
   */
  const meetPrerequisite = (toCheckSubject, thisYear, thisTri, afterTransferPS, subList, ch2d) => {
    let isMeet = true;
    if(toCheckSubject === "TPT2201" || toCheckSubject.includes("TPT3101")) {    // if is industrial training 
      let sumCH = 0;
      const minCHRequire = (toCheckSubject === "TPT2201") ? 60 : 50;  // 60 for internship, 50 for fyp
      for (let year = 0; year < thisYear; year++) {
        for (let tri = 0; tri < thisTri; tri++) {
          sumCH += ch2d[year][tri];
        }
      }
      isMeet = (sumCH < minCHRequire) ? false : true;   // if total taken credit hour 
    }
    // check if prerequisite is all taken in previous trimester 
    if(isMeet) {
      subList.get(toCheckSubject).prereq.forEach((prereqSubjCode) => {
        if(afterTransferPS.get(prereqSubjCode) && (afterTransferPS.get(prereqSubjCode).defaultYear > thisYear || 
            (afterTransferPS.get(prereqSubjCode).defaultYear === thisYear && afterTransferPS.get(prereqSubjCode).defaultTri >= thisTri))){
          isMeet = false;
        }
      });
    }
    return isMeet;
    // create a map from the credit transferred subjects 
    // for every subject s in afterTransferPS
    //   if s does not have any prerequisite
    //     add s to map
    //   else 
    //     if map has prerequisite s.p
    //       add s to map
    //     else
    //       return false
    // return true 

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
            {Array.from(selectedPS.entries()).map((entry) => {
              const [code, val] = entry;
              if (val.defaultYear === yearNum) {
                return (
                  <tr>
                    <td>{val.type}</td>
                    <td>{code}</td>
                    <td>{val.name}</td>
                    <td>{val.ch}</td>
                    <td>{val.defaultTri}</td>
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