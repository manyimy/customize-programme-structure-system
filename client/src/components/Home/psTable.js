import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

require("dotenv").config();
const API_PATH = process.env.REACT_APP_API_PATH;
const MAX_CH = 122;

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: "center",
  },
  psTable: {
    maxWidth: "50vw",
    textAlign: "center",
  },
  sumTable: {
    minWidth: 700,
  },
  tableCont: {
    width: "60vw",
    minWidth: "50vw",
    maxWidth: "80vw",
    margin: "20px 10px 50px"
  },
  psTableHead: {
    // backgroundColor: "#C5CAE9",
    backgroundColor: theme.palette.primaryHead,
  },
  tableCaption: {
    textAlign: "right",
  },
  bgGray: {
    backgroundColor: theme.palette.action.hover,
  }
}));

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

export default function PSTable(props) {
  const classes = useStyles();

  // const [intakeNum, setIntakeNum] = useState(null);
  const [selectedPS, setSelectedPS] = useState(new Map());
  const [triSeq, setTriSeq] = useState([]);
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
    // format transferred subject list into subject code only
    for (let i = 0; i < props.trans.length; i++) {
      props.transCode[i] = props.trans[i].substr(0, props.trans[i].indexOf(' '));
    }

    // fetch subjectList and standardPS from server
    axios
      .get(API_PATH + "/subjectList.json")
      .then((res) => {
        let subList = new Map(res.data)
        setSubjectList(subList);

        axios
          .get(API_PATH + "/standardPS.json")
          .then((response) => {
            let generatedPS;
            for (let i = 0; i < response.data.length; i++) {
              const element = response.data[i];
              if (element.intake === props.intake) {
                generatedPS = MoveByPriority(new Map(res.data), element);
                setTriSeq(element.trimesterSeq);
              }
            }
            setSelectedPS(generatedPS);
          }).catch((err) => {
            console.log(err);
          });
      }).catch((err) => {
        console.log(err);
      });
  }, []);

  /**
   * Generate Customized Programme Structure 
   * @param  {Map} subList map list of subjects
   * @param  {Map} standard standard programme structure
   * @returns {Map} generated programme structure
   */
  const MoveByPriority = (subList, intake) => {
    let afterTransferPS = new Map();       // programme structure after removal of credit transferred subjects
    let ch2d = [];                         // credit hour array
    ch2d.push([0,0,0],[0,0,0],[0,0,0]);    // stored in the order of [trimester 1, trimester 2, trimester 3] regardless of intake and trimester sequence
    let triSeq = intake.trimesterSeq;

    // loop subjects in the selected specialization and intake
    for (const [code, val] of intake.PS[props.spec]) {
      // if current subject is not transferred, push into the afterTransferPS array
      if (!props.transCode.includes(code)) {
        afterTransferPS.set(code, val);
        ch2d[val.defaultYear-1][val.defaultTri-1] += val.ch;
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
      let priority = subj.defaultYear*1000 + triSeq.indexOf(subj.defaultTri)*100 + 90;
      if(subj.defaultTri === 3) {priority += 1000;}
      if(code.includes("TPT3101")) {priority -= 2000;}
      priorityList.set(code, priority);
    }
  
    for (const [key, value] of subList) {
      if(priorityList.has(key)) { 
        priorityList.set(key, priorityList.get(key)-(4-value.offer.length)*10); 
        value.prereq.forEach(prereq => {
          if(priorityList.has(prereq)) {
            priorityList.set(prereq, priorityList.get(prereq)-200);
          }
        });
      }
    }

    let sortedList = new Map([...priorityList.entries()].sort((a, b) => a[1] - b[1]));  // sort into non-decreasing order
    
    priorityList = new Map(sortedList);
    console.log(Array.from(priorityList.entries()));

    // Step 2: loop until all subjects are placed
    //    - remove existed subject of the current trimester from toBePlacedSubjects list
    //    - check if credit hour of the trimester is enough/full
    //    - if not, take the highest priority subject offered to replace
    for (let thisYear = 1; thisYear <= 3; thisYear++) {
      for (let thisTriNum = 1; thisTriNum <= 3; thisTriNum++) {
        let thisTri = triSeq[thisTriNum-1];  

        // remove existed subjects of current trimester from toBePlacedSubjects and priority list
        for (const [code, val] of afterTransferPS) {
          if(val.defaultYear <= thisYear && triSeq.indexOf(val.defaultTri) <= thisTriNum-1 && priorityList.has(code)){
            priorityList.delete(code);
          }
        }

        if(!(afterTransferPS.get('TPT2201').defaultYear === thisYear && afterTransferPS.get('TPT2201').defaultTri === thisTri)) {
          let maxCHOfTri = (thisTri===3) ? props.shortLimit : props.longLimit;
          var candidateSubject = anyReplaceble(thisYear, thisTri, thisTriNum, triSeq, priorityList, subList, ch2d, maxCHOfTri, afterTransferPS);
          while(ch2d[thisYear-1][thisTri-1] < maxCHOfTri && candidateSubject) {

            let subjDetail = afterTransferPS.get(candidateSubject);
            ch2d[subjDetail.defaultYear-1][subjDetail.defaultTri-1] -= subjDetail.ch;
            subjDetail.defaultTri = thisTri;
            subjDetail.defaultYear = thisYear;
            afterTransferPS.set(candidateSubject, subjDetail);
            ch2d[thisYear-1][thisTri-1] += subjDetail.ch;      // [1,2,3][1,2,3][1,2,3]  triSeq=[2,3,1]  thisTri=3, thisTriNum=2
            priorityList.delete(candidateSubject);

            candidateSubject = anyReplaceble(thisYear, thisTri, thisTriNum, triSeq, priorityList, subList, ch2d, maxCHOfTri, afterTransferPS);
          }
        }
      }
    }
    return sortPSMap(afterTransferPS, triSeq);
  }

  // 
  /**
   * Check if any subject can be replaced
   * @param  {number} thisYear current year
   * @param  {number} thisTri current trimester
   * @param  {number} thisTriNum number of trimester (eg. thisTri = 1, triSeq = [2,3,1], then thisTriNum=3)
   * @param  {Array} triSeq the trimester sequece of the intake
   * @param  {Map} priorityList map list of subject and its priority value
   * @param  {Map} subList map list of all subjects
   * @param  {Array} ch2d 2D array of all trimesters' credit hour
   * @param  {number} maxCHOfTri maximum credit hour of the trimester
   * @param  {Map} afterTransferPS programme structure after credit transfer
   * @returns {(string|null)} candidate subject code or null
   */
  const anyReplaceble = (thisYear, thisTri, thisTriNum, triSeq, priorityList, subList, ch2d, maxCHOfTri, afterTransferPS) => {
    for (const [prioritySubjectCode, value] of priorityList) {
      if( subList.get(prioritySubjectCode) && subList.get(prioritySubjectCode).offer.includes(thisTri) && 
          meetPrerequisite(prioritySubjectCode, thisYear, thisTri, thisTriNum, triSeq, afterTransferPS, subList, ch2d, maxCHOfTri)) {
        return prioritySubjectCode;
      }
    }
    return null;
  }

  /**
   * Sort programme structure map in year and trimester sequence order
   * @param  {Map} toSortPS the programme structure to be sorted
   * @param  {Array} triSeq the trimester sequece of the intake
   * @returns {Map} sorted programme structure
   */
  const sortPSMap = (toSortPS, triSeq) => {
    let sortedPS = new Map();
    for (let y = 1; y <= 3; y++) {
      triSeq.forEach(t => {
        for (let [code, val] of toSortPS) {
          if(val.defaultYear===y && val.defaultTri===t) {
            sortedPS.set(code, val);
          }
        }
      });
    }
    return sortedPS;
  }

  // calculate total credit transferred credit hours
  const sumTransferredCH = () => {
    let totalCHTransferred = 0;
    props.trans.forEach(transSubject => {
      totalCHTransferred += Number(transSubject.substr(transSubject.trim().length-3, 1))
    });
    return totalCHTransferred;
  }

  /**
   * Check if the subject meets the prerequisite requirements
   * special requirements:
   *  - fyp: 50 credit hours
   *  - industrial training: 60 credit hours
   */
  const meetPrerequisite = (toCheckSubject, thisYear, thisTri, thisTriNum, triSeq, afterTransferPS, subList, ch2d, maxCHOfTri) => {
    let isMeet = true;
    if(ch2d[thisYear-1][thisTri-1] + subList.get(toCheckSubject).ch > maxCHOfTri) {
      return false
    };
    if(toCheckSubject === "TPT2201" && ch2d[thisYear-1][thisTri-1] != 0) {     // if the trimester already has subject, then industrial training is not allowed
      return false;
    }
    if(toCheckSubject === "TPT2201" || toCheckSubject.includes("TPT3101")) {    // if is industrial training or fyp
      const minCHRequire = (toCheckSubject === "TPT2201") ? 60 : 50;  // 60 for internship, 50 for fyp
      isMeet = (isMeet && checkCHwoMPU(afterTransferPS, thisYear, thisTriNum, triSeq) + sumTransferredCH(subList) < minCHRequire) ? false : true;   // if total taken credit hour 
    }
    // check if prerequisite is all taken in previous trimester 
    if(isMeet) {
      subList.get(toCheckSubject).prereq.forEach((prereqSubjCode) => {
        // if prerequisite subject is yet to be taken (its trimester or year are later)
        if(afterTransferPS.get(prereqSubjCode) && (afterTransferPS.get(prereqSubjCode).defaultYear > thisYear || 
            (afterTransferPS.get(prereqSubjCode).defaultYear === thisYear && triSeq.indexOf(afterTransferPS.get(prereqSubjCode).defaultTri) >= thisTriNum-1))){
          isMeet = false;
        }
      });
    }

    // if fyp 1 is available, straight check if fyp2 is replacable
    if(isMeet && toCheckSubject === "TPT3101a") {
      let tempPS = new Map(JSON.parse(JSON.stringify(Array.from(afterTransferPS))));
      let tempCh2d = JSON.parse(JSON.stringify(ch2d));
      let fyp1Detail = tempPS.get("TPT3101a");
      tempCh2d[fyp1Detail.defaultYear-1][fyp1Detail.defaultTri-1] -= fyp1Detail.ch;
      fyp1Detail.defaultYear = thisYear;
      fyp1Detail.defaultTri = thisTri;
      tempPS.set("TPT3101a", fyp1Detail);
      tempCh2d[thisYear-1][thisTri-1] += fyp1Detail.ch;
      return meetPrerequisite("TPT3101b", thisYear, triSeq[thisTriNum], thisTriNum+1, triSeq, tempPS, subList, tempCh2d, maxCHOfTri);
    }
    return isMeet;
  }

  const checkCHwoMPU = (afterTransferPS, thisYear, thisTriNum, triSeq) => {
    let totalCH = 0;
    for (const [code, detail] of afterTransferPS) {
      if((detail.defaultYear < thisYear || (detail.defaultYear === thisYear && triSeq.indexOf(detail.defaultTri) < thisTriNum-1)) && !detail.name.includes("MPU")) {
        totalCH += detail.ch;
      }
    }
    return totalCH;
  }

  function yearTotalCH(year, tri=null) {
    let sum = 0;
    for (const [code, value] of selectedPS) {
      if(tri) {
        if(value.defaultYear === year && value.defaultTri === tri) {
          sum += value.ch;
        }
      }
      else if(value.defaultYear === year) {
        sum += value.ch;
      }
    }
    return sum;
  }

  function yearTotalSubject(year, tri=null) {
    let num = 0;
    for (const [code, value] of selectedPS) {
      if(tri) {
        if(value.defaultYear === year && value.defaultTri === tri) {
          num++;
        }
      }
      else if(value.defaultYear === year) {
        num++;
      }
    }
    return num;
  }
  
  function Row(props) {
    const { year } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();
  
    return (
      <React.Fragment>
        <TableRow>
          <TableCell width={10}>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell align="center" component="th" scope="year">
            {year}
          </TableCell>
          <TableCell align="center">{yearTotalSubject(year)}</TableCell>
          <TableCell align="center">{yearTotalCH(year)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Summary
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Trimester</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell align="right">Credit Hour</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {triSeq.map((tri) => (
                      <TableRow key={tri}>
                        <TableCell component="th" scope="tri">
                          {tri}
                        </TableCell>
                        <TableCell>{yearTotalSubject(year, tri)}</TableCell>
                        <TableCell align="right">{yearTotalCH(year, tri)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  function RowTransSubj(props) {
    const { trans } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();
  
    return (
      <React.Fragment>
        <TableRow>
          <TableCell rowSpan={5} colSpan={2} />
          <TableCell>
            Total Credit Transferred Subject
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell align="right">{props.trans.length}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  List of Subject Transferred
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Credit Hour</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.trans.map((subj) => (
                      <TableRow key={subj}>
                        <TableCell component="th" scope="tri">
                          {subj.substring(0, subj.indexOf(' '))}
                        </TableCell>
                        <TableCell>{subj.substring(subj.indexOf(' '), subj.indexOf(' - '))}</TableCell>
                        <TableCell align="right">{subj.substr(subj.length-3, 1)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  return (
    <div className={classes.container}>
      <TableContainer className={classes.tableCont} component={Paper}>
        <Table className={classes.sumTable} size="small" aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2} size="small"></TableCell>
              <TableCell align="center" rowSpan={2}>
                Year
              </TableCell>
              <TableCell align="center" colSpan={2}>Amount</TableCell>
            </TableRow>
            <TableRow>
              {/* <TableCell></TableCell> */}
              <TableCell width={"33%"} align="center">Subject</TableCell>
              <TableCell width={"33%"} align="center">Credit Hour</TableCell>
              {/* <TableCell align="center">Sum</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {[1,2,3].map((year) => (
              <Row key={year} year={year} />
            ))}

            {/* <TableRow>
              <TableCell rowSpan={4} colSpan={2} />
              <TableCell>Total Credit Transferred Subject</TableCell>
              <TableCell align="right">{props.trans.length}</TableCell>
            </TableRow> */}
            <RowTransSubj key="transSubj" trans={props.trans}/>
            <TableRow>
              <TableCell>Total Credit Transferred Hour</TableCell>
              <TableCell align="right">{sumTransferredCH(subjectList)}</TableCell>
              {/* <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell> */}
            </TableRow>
            <TableRow>
              <TableCell>Total Subject</TableCell>
              <TableCell align="right">{yearTotalSubject(1)+yearTotalSubject(2)+yearTotalSubject(3)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Credit Hour</TableCell>
              <TableCell align="right">{yearTotalCH(1)+yearTotalCH(2)+yearTotalCH(3)}</TableCell>
              {/* <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell> */}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {[1,2,3].map((yearNum) => {
        return (
          <React.Fragment>
            <Typography variant="h3" component="h4">Year {yearNum}</Typography>
            <Table size="small" id={"ps-table-y"+yearNum} className={classes.psTable}>
              <caption><div className={classes.tableCaption}>Total Subject: {yearTotalSubject(yearNum)}<br/>Total Credit Hour: {yearTotalCH(yearNum)}</div></caption>
              <TableHead className={classes.psTableHead}>
                <TableRow>
                  <TableCell align="center" style={{padding: "6px 30px", width: "10%"}} dataStyle="Title">Category</TableCell>
                  <TableCell align="center" style={{padding: "6px 30px", width: "20%"}} dataStyle="Title">Subject Code</TableCell>
                  <TableCell align="center" style={{padding: "6px 30px", width: "55%"}} dataStyle="Title">Subject Name</TableCell>
                  <TableCell align="center" style={{padding: "6px 30px", width: "5%"}} dataStyle="Title">CH</TableCell>
                  <TableCell align="center" style={{padding: "6px 30px", width: "10%"}} dataStyle="Title">Trimester</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from(selectedPS.entries()).map((entry, index) => {
                  const [code, val] = entry;
                  if (val.defaultYear === yearNum) {
                    return (
                      <TableRow className={(val.defaultTri===triSeq[0] || val.defaultTri===triSeq[2]) ? classes.bgGray : classes.none}>
                        <TableCell align="center" datatype="String" dataStyle="Content">{val.type}</TableCell>
                        <TableCell align="center" datatype="string" dataStyle="Content">{code}</TableCell>
                        <TableCell align="center" datatype="String" dataStyle="Content">{val.name}</TableCell>
                        <TableCell align="center" datatype="Number" dataStyle="Content">{val.ch}</TableCell>
                        <TableCell align="center" datatype="Number" dataStyle="Content">{val.defaultTri}</TableCell>
                      </TableRow>
                    );
                  } else {
                    return <React.Fragment></React.Fragment>;
                  }
                })}
              </TableBody>
            </Table>
          </React.Fragment>
        );
      })}
    </div>
  );
}