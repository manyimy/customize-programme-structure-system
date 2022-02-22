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
  const [selectedPS, setSelectedPS] = useState([]);
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
    let test = new Map();
    test.set('ABC1234', {name: "Testing", ch: 4});
    console.log(test);
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
    let afterTransferPS = [];       // programme structure after removal of credit transferred subjects
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
        // console.log(element.PS[props.spec]);  
        // console.log(props.trans);

        // for each subjects of the selected specialization and intake
        let index = 0;
        for (let a = 0; a < element.PS[props.spec].length; a++) {
          const subject = element.PS[props.spec][a];
          // console.log(subject.code + " " + subject.name);
          // console.log(props.trans.includes(subject.code + " " + subject.name));

          // if transferred subjects does not include the current subject, 
          // push into the afterTransferPS array
          if (!props.trans.includes(subject.code + " " + subject.name)) {
            afterTransferPS.push(subject);
            ch2d[subject.defaultYear-1][subject.defaultTri-1] += subject.ch;
            index++;
          } else {
            creditHour -= subject.ch;
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
        afterTransferPS.forEach(subj => {
          /**
           * 1190 to Year 1 Trimester 1 subjects
           * 1290 to Year 1 Trimester 2 subjects
           * 1390 to Year 1 Trimester 3 subjects
           * 2190 to Year 2 Trimester 1 subjects
           */
          priorityList.set(subj.code, subj.defaultYear*1000 + subj.defaultTri*100 + 90);
        });

        console.log(afterTransferPS);
        console.log(priorityList);
        console.log(subList);


        Array.from(subList.entries()).forEach(entry => {
          const [key, value] = entry;
          console.log(entry);
          if(priorityList.has(key)) { 
            // console.log("has " + subj.code);

            // if the subject is offered once a thisYear: -40  (xx90 -> xx50)
            if(value.offer.length === 2) {
              priorityList.set(key, priorityList.get(key)-10); 
            }
            value.prereq.forEach(prereq => {
              if(priorityList.has(prereq)) {
                priorityList.set(prereq, priorityList.get(prereq)-10);
              }
            });
          }
        });
        console.log(priorityList);

        let sortedList = new Map([...priorityList.entries()].sort((a, b) => a[1] - b[1]));  // sort into non-decreasing order
        
        priorityList = new Map(sortedList);
        console.log(priorityList);
        
        // Step 2: Initialize visited and toBePlacedSubjects set
        // var visited = [];
        var toBePlacedSubjects = [];    // only contains subjects code
        afterTransferPS.forEach(element => {
          toBePlacedSubjects.push(element.code);
        });
        console.log(toBePlacedSubjects);    

        // Step 3: loop until all subjects are placed
        //    - remove existed subject of the current trimester from toBePlacedSubjects list
        //    - check if credit hour of the trimester is enough/full
        //    - if not, take the highest priority subject offered to replace
        console.log(afterTransferPS);

        for (let thisYear = 1; thisYear <= 3; thisYear++) {
          for (let thisTri = 1; thisTri <= 3; thisTri++) {

            // remove existed subjects of current trimester from toBePlacedSubjects list
            afterTransferPS.forEach(subject => {
              if(subject.defaultYear === thisYear && subject.defaultTri === thisTri){
                toBePlacedSubjects.splice(toBePlacedSubjects.indexOf(subject.code), 1);
              }
            });

            console.log(toBePlacedSubjects);

            let maxCHOfTri = (thisTri===3) ? 10 : 20;
            var candidateSubject = anyReplaceble(thisYear, thisTri, priorityList, toBePlacedSubjects, subList, ch2d, maxCHOfTri);
            console.log("candidateSubject");
            console.log(candidateSubject);
            while(ch2d[thisYear-1][thisTri-1] <= maxCHOfTri && candidateSubject) {

              for (let num = 0; num < afterTransferPS.length; num++) {
                const toReplace = afterTransferPS[num];
                if(toReplace.code === candidateSubject) {
                  console.log(afterTransferPS[num]);
                  afterTransferPS[num].defaultTri = thisTri;
                  afterTransferPS[num].defaultYear = thisYear;
                  ch2d[thisYear-1][thisTri-1] += afterTransferPS[num].ch;
                  toBePlacedSubjects.splice(toBePlacedSubjects.indexOf(candidateSubject), 1);
                  break;
                }
              }
              // candidateSubject = anyReplaceble(thisYear, thisTri, priorityList, toBePlacedSubjects, subList, ch2d, maxCHOfTri);

              // Array.from(priorityList.entries()).forEach(entry => {
              //   const [key, value] = entry;
                
              //   // check if the highest priority subject is already visited
              //   if(toBePlacedSubjects.includes(key)){


              //   }
              // });
              // for (const [prioritySubject, value] of priorityList) {
              //   console.log(prioritySubject);
              //   console.log(value);
              //   console.log(toBePlacedSubjects.includes(prioritySubject));
              //   // check if the highest priority subject is already visited
              //   if(toBePlacedSubjects.includes(prioritySubject)){
              //     let availability = false;
              //     // check if the subject is offered in the trimester
              //     subList.every(sub => {
              //       if(sub.code === prioritySubject) {
              //         console.log(sub.offer);
              //         if(sub.offer.includes(thisTri) && ch2d[thisYear-1][thisTri-1] + sub.ch <= maxCHOfTri) {
              //           availability = true;
              //           return false;   // works as break
              //         }
              //       }
              //       return true;  // to keep the every looping
              //     });
              //     // move the priority subject to the current trimester
              //     if(availability) {
              //       for (let num = 0; num < afterTransferPS.length; num++) {
              //         const toReplace = afterTransferPS[num];
              //         if(toReplace.code === prioritySubject) {
              //           console.log(afterTransferPS[num]);
              //           afterTransferPS[num].defaultTri = thisTri;
              //           afterTransferPS[num].defaultYear = thisYear;
              //           ch2d[thisYear-1][thisTri-1] += afterTransferPS[num].ch;
              //           toBePlacedSubjects.splice(toBePlacedSubjects.indexOf(prioritySubject), 1);
              //           break;
              //         }
              //       }
              //       break;
              //     }
              //   }
              // }
            }
            console.log(ch2d[thisYear-1][thisTri-1]);
          }
        }

        // while (toBePlacedSubjects.length !== 0) {
        //   console.log("thisYear: " + thisYear + "\ntri: " + thisTri);
        //   console.log(toBePlacedSubjects);
          
        //   // remove existed subjects of current trimester from toBePlacedSubjects list
        //   for (let i = 0; i < afterTransferPS.length; i++) {
        //     const afterSubj = afterTransferPS[i];
            
        //     if(afterSubj.defaultYear === thisYear && afterSubj.defaultTri === thisTri){
        //       toBePlacedSubjects.splice(toBePlacedSubjects.indexOf(afterSubj.code), 1);
        //     }
        //   }
        //   /**
        //    * trimester 1 & 2: 12 to 20 CH
        //    * trimester 3: 6 to 10 CH
        //    */
        //   let maxCHOfTri = (thisTri===3) ? 10 : 20;
        //   let optimumOfTheTri = (thisTri===3) ? 6 : 16;
        //   let infinitBreak = 0;
        //   let keepLoop = true;
        //   while(ch2d[thisYear-1][thisTri-1] <= maxCHOfTri ){    // if the trimester still can add subject
        //     console.log(thisYear);
        //     console.log(thisTri);
        //     console.log(ch2d[thisYear-1][thisTri-1]);
        //     //debug
        //     console.log("still in this while loop " + infinitBreak++);
        //     if(infinitBreak > 50) { break; }

        //     for (const [prioritySubject, value] of priorityList) {
        //       console.log(prioritySubject);
        //       console.log(toBePlacedSubjects.includes(prioritySubject));
        //       // check if the highest priority subject is already visited
        //       if(toBePlacedSubjects.includes(prioritySubject)){
        //         let availability = false;
        //         // check if the subject is offered in the trimester
        //         subList.every(sub => {
        //           if(sub.code === prioritySubject) {
        //             console.log(sub.offer);
        //             if(sub.offer.includes(thisTri) && ch2d[thisYear-1][thisTri-1] + sub.ch <= maxCHOfTri) {
        //               availability = true;
        //               return false;   // works as break
        //             }
        //           }
        //           return true;  // to keep the every looping
        //         });
        //         // move the priority subject to the current trimester
        //         if(availability) {
        //           for (let num = 0; num < afterTransferPS.length; num++) {
        //             const toReplace = afterTransferPS[num];
        //             if(toReplace.code === prioritySubject) {
        //               console.log(afterTransferPS[num]);
        //               afterTransferPS[num].defaultTri = thisTri;
        //               afterTransferPS[num].defaultYear = thisYear;
        //               ch2d[thisYear-1][thisTri-1] += afterTransferPS[num].ch;
        //               toBePlacedSubjects.splice(toBePlacedSubjects.indexOf(prioritySubject), 1);
        //               break;
        //             }
        //           }
        //           break;
        //         }
        //       }
        //     }

        //     /**
        //      * Quit condition: either reaches max credit hour or
        //      * no subject in the priority list is offered in the trimester and has credit hour that fits
        //      */
        //     let anyReplaceble = false;
        //     for (let num = 0; num < priorityList.length; num++) {
        //       const pSubj = priorityList[num];
        //       subList.forEach(sub => {
        //         if(sub.code === pSubj && sub.offer.includes(thisTri) && 
        //            ch2d[thisYear][thisTri]+sub.ch <= maxCHOfTri) {
        //           anyReplaceble=true;
        //         }
        //       });
        //     }
        //     keepLoop = anyReplaceble;
        //   }
        //   if(thisTri===3){
        //     thisYear++;
        //     thisTri=1;
        //   } else { thisTri++; }
        // }
        break;
      }
    }
    return afterTransferPS;
  }

  const anyReplaceble = (thisYear, thisTri, priorityList, toBePlacedSubjects, subList, ch2d, maxCHOfTri) => {
    console.log(toBePlacedSubjects);
    let candidateSubject = null; 
    for (let index = 0; index < Array.from(priorityList.keys()).length; index++) {
      const prioritySubjectCode = Array.from(priorityList.keys())[index];
      if(subList.get(prioritySubjectCode) && toBePlacedSubjects.includes(prioritySubjectCode) && subList.get(prioritySubjectCode).offer.includes(thisTri) && 
          ch2d[thisYear-1][thisTri-1] + subList.get(prioritySubjectCode).ch <= maxCHOfTri) {
        console.log(prioritySubjectCode);
        candidateSubject = prioritySubjectCode;
        break;
      }
    }

    // Array.from(priorityList.entries()).forEach(entry => {
    //   const [key, value] = entry;
    //   if(subList.get(key) && toBePlacedSubjects.includes(key) && subList.get(key).offer.includes(thisTri) && 
    //       ch2d[thisYear-1][thisTri-1] + subList.get(key).ch <= maxCHOfTri) {
    //     console.log(key);
    //     candidateSubject = key;
    //     break;
    //   }
    // });
    return candidateSubject;
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