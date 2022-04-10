import React , { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import MuiAlert from "@material-ui/lab/Alert";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { ButtonGroup, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import SaveIcon from "@material-ui/icons/Save";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit'
import CloseIcon from '@material-ui/icons/Close';

import axios from "axios";
const API_PATH = process.env.REACT_APP_API_PATH;
const ALL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  selectionCont: {
    justifyContent: "center"
  },
  table: {
    width: "70vw",
    marginLeft: "auto",
    marginRight: "auto",
    overflowX: "visible",
  },
  tableBody: {
    overflowY: "scroll",
  },
  // btnGrpCont: {
  //   textAlign: "center",
  //   marginBottom: "20px",
  // },
  typoh1: {
    textAlign: "center",
  },
  addBtn: {
    float: "right",
  },
  saveBtn: {
    float: "right",
    position: "fixed",
    bottom: "3vh",
    right: "3vw",
  },
  formControl: {
    // margin: theme.spacing(1),
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(0.5),
  },
  speedDial: {
    position: "absolute"
  },
  seqCont: {
    padding: "40px 0",
  },
  seqSelect: {
    margin: "0 0 0 20px",
  },
}));

export default function EditSPS(props) {
  const classes = useStyles();

  const [years, setYears] = React.useState([]);
  const [subjectList, setSubjectList] = React.useState(new Map());
  const [selectionDisable, setSelectionDisable] = React.useState(false);        // disable initial selection of intake and spec
  const [openSnackbar, setOpenSnackbar] = React.useState(false);                // snackbar visibility
  const [snackbarMsg, setSnackbarMsg] = React.useState("");                     // snackbar message
  const [snackbarSev, setSnackbarSev] = React.useState("error");                // snackbar severity
  const [openDeletePS, setOpenDeletePS] = React.useState(false);                // 
  const [openDeletePSDialog, setOpenDeletePSDialog] = React.useState(false);    // open confirmation dialog
  const [openSpeedDial, setOpenSpeedDial] = React.useState(false);              // open speed dial all actions
  const [toDeleteSubject, setToDeleteSubject] = React.useState(-99);            // index of subject to delete
  const [selectedIntake, setSelectedIntake] = React.useState("");               // initial selection intake
  const [selectedSpec, setSelectedSpec] = React.useState("");                   // initial selection specialization
  const [standardPS, setStandardPS] = React.useState([]);                       // standard programme structure from server JSON file
  const [editingPS, setEditingPS] = React.useState(new Map());                         // current editting programme structure (old)
  const [standardIndex, setStandardIndex] = React.useState("");
  const [openAddPS, setOpenAddPS] = React.useState(false);
  const [openCopyPS, setOpenCopyPS] = React.useState(false); 
  const [newIntakeMonth, setNewIntakeMonth] = React.useState("");     // month of new intake to be created
  const [newIntakeYear, setNewIntakeYear] = React.useState("");       // year of new intake to be created
  const [copyFromIntake, setCopyFromIntake] = React.useState("");     // intake to be copy from
  const [toDeleteIntake, setToDeleteIntake] = React.useState("");     // programme structure of intake to be deleted
  const [toDeleteSpec, setToDeleteSpec] = React.useState(""); 
  const [triSeq, setTriSeq] = React.useState([]);         // trimester sequence
  const [inputs, setInputs] = React.useState([
    {
      type: "",
      code: "",
      name: "",
      ch: "",
      offer: [],
      defaultTri: "",
    },
    {
      type: "",
      code: "",
      name: "",
      ch: "",
      offer: [],
      defaultTri: "",
    },
    {
      type: "",
      code: "",
      name: "",
      ch: "",
      offer: [],
      defaultTri: "",
    }
  ]);

  useEffect(() => {
    axios.get(API_PATH + "/subjectList.json").then((response) => {
      setSubjectList(new Map(response.data));
      console.log(new Map(response.data));
    }).catch(err => {
      console.log(err);
    });
    
    axios.get(API_PATH + "/standardPS.json").then((response) => {
      setStandardPS(response.data);
    }).catch(err => {
      console.log(err);
    });;

    let thisYear = (new Date()).getFullYear();
    let years = [];
    for(let i = thisYear-3; years.length <= 5; i++) {
      years.push(i);
    }
    setYears(years);
  }, []);

  // Speed dial tooltips
  const actions = [
    { icon: <AddIcon />, name: 'Add', action: (e) => handleActionAddPS(e), disabled: selectionDisable },
    { icon: <FileCopyIcon />, name: 'Copy', action: (e) => handleActionCopyPS(e), disabled: selectionDisable },
    { icon: (!selectionDisable) ? <EditIcon /> : <CloseIcon />, name: (!selectionDisable) ? 'Edit' : 'Close', 
            action: (e) => (!selectionDisable) ? handleActionEditPS(e) : handleActionCloseEditPS(e),
            disabled: (selectedIntake && selectedSpec) ? false : true 
    },
    { icon: <DeleteIcon />, name: 'Delete', action: (e) => handleActionDeletePS(e), disabled: selectionDisable },
  ];

  const handleCloseSnackbar = () => {
    setSnackbarMsg("");
    setSnackbarSev("");
    setOpenSnackbar(false);
  };

  // onchange input new subjects 
  const onChange = (e, inputIndex) => {
    let { name, value } = e.target;
    
    if(name === "subject") {
      let updateInputs = [...inputs];
      const [key, val] = value; 
      updateInputs[inputIndex] = {
        ...updateInputs[inputIndex],
        code: key,
        name: val.name,
        ch: Number(val.ch),
        offer: val.offer
      };
      
      setInputs(updateInputs);
    } else {
      let updateInputs = [...inputs];
      updateInputs[inputIndex] = {
        ...updateInputs[inputIndex],
        [name]: (name === "defaultTri") ? Number(value) : value
      };
      
      setInputs(updateInputs);
    }
  };

  // Confirmation dialog for delete subject from programme structure
  const handleOpenDialog = (event, subjectCode) => {
    event.preventDefault();
    setToDeleteSubject(subjectCode);
    setOpenDeletePSDialog(true);
  };

  const handleCloseDialog = (event) => {
    event.preventDefault();
    setToDeleteSubject(null);
    setOpenDeletePSDialog(false);
  };

  // handle add subject to programme structure
  const handleAdd = (e, year) => {
    e.preventDefault();
    if (
      !inputs[year].name ||
      !inputs[year].defaultTri
    ) {
      setSnackbarMsg("Subject and default trimesters cannot be empty.");
      setSnackbarSev("error");
      setOpenSnackbar(true);
    } else {
      let updatePS = new Map(editingPS);
      updatePS.set(inputs[year].code, {
        name: inputs[year].name,
        ch: Number(inputs[year].ch),
        type: inputs[year].type,
        defaultTri: Number(inputs[year].defaultTri),
        defaultYear: year + 1,
      });

      let updateInputs = [...inputs];
      updateInputs[year] = {
        ...updateInputs[year],
        type: "",
        code: "",
        name: "",
        ch: "",
        defaultTri: ""
      }
      setInputs(updateInputs);
      setEditingPS(new Map(updatePS));
    }
  };

  // handle delete subject from programme structure
  const handleDelete = (e) => {
    let mapCopy = new Map(editingPS);
    mapCopy.delete(toDeleteSubject);
    setEditingPS(mapCopy);
    setSnackbarMsg("Subject removed.");
    setSnackbarSev("success");
    setOpenSnackbar(true);
    handleCloseDialog(e);
  };

  // handle save modified programme structure
  const handleSave = (e) => {
    e.preventDefault();
    let copyStandard = JSON.parse(JSON.stringify(standardPS));
    for (let i = 0; i < standardPS.length; i++) {
      const element = standardPS[i];
      if(selectedIntake === element.intake) {
        copyStandard[i].trimesterSeq = triSeq;
        copyStandard[i].PS[selectedSpec] = [...editingPS];
        break;
      }
    }
    setStandardPS(JSON.parse(JSON.stringify(copyStandard)));
    setSelectionDisable(false);
    let emptyInputs = [
      {
        type: "",
        code: "",
        name: "",
        ch: "",
        offer: [],
        defaultTri: "",
      },
      {
        type: "",
        code: "",
        name: "",
        ch: "",
        offer: [],
        defaultTri: "",
      },
      {
        type: "",
        code: "",
        name: "",
        ch: "",
        offer: [],
        defaultTri: "",
      },
    ];
    axios
      .post(API_PATH + "/standardPS", {
        newPS: copyStandard,
      })
      .then((res) => {
        setSnackbarMsg("Updated Successfully.");
        setSnackbarSev("success");
        setOpenSnackbar(true);
        setInputs(emptyInputs);
        // refresh
        // window.location.reload(false);
      })
      .catch((err) => {
        console.log(err);
      });
    document.getElementById("psTable-container").style.display = "none";
  };
  
  // Speed Dial
  const handleCloseSpeedDial = () => {
    setOpenSpeedDial(false);
  };
  
  const handleOpenSpeedDial = () => {
    setOpenSpeedDial(true);
  };

  // Action: Delete Selected Programme Structure
  const handleActionDeletePS = (e) => {
    e.preventDefault();
    setOpenDeletePS(true);
  };

  const handleCloseDeletePSDialog = (event) => {
    event.preventDefault();
    setToDeleteSpec("");
    setToDeleteIntake("");
    setOpenDeletePS(false);
  };

  const confirmDeletePS = () => {
    // let toDeletePS = selectedIntake;
    setSelectedSpec("");
    setSelectedIntake("");
    let temp = JSON.parse(JSON.stringify(standardPS));
    if(!toDeleteSpec) {
      for (let i = 0; i < standardPS.length; i++) {
        const ps = standardPS[i];
        if(ps.intake === toDeleteIntake) {
          temp.splice(i, 1);
          break;
        }
      }
    } else {
      for (let i = 0; i < standardPS.length; i++) {
        const ps = standardPS[i];
        if(ps.intake === toDeleteIntake) {
          temp[i].PS[toDeleteSpec] = [];
          break;
        }
      }
    }
    setStandardPS(JSON.parse(JSON.stringify(temp)));
    axios
      .post(API_PATH + "/standardPS", {
        newPS: temp
      })
      .then((res) => {
        setSnackbarMsg(toDeleteIntake + ((toDeleteSpec) ? ( " " + toDeleteSpec) : "") + " has been deleted.");
        setSnackbarSev("success");
        setOpenSnackbar(true);
        setToDeleteSpec("");
        setToDeleteIntake("");
        // refresh
        // window.location.reload(false);~
      })
      .catch((err) => {
        console.log(err);
      });
    setOpenDeletePS(false);
  };

  // Action: Add New Programme Structure
  const handleActionAddPS = (e) => {
    e.preventDefault();
    setOpenAddPS(true);
  };

  const handleCloseAddPSDialog = (event) => {
    event.preventDefault();
    setNewIntakeMonth("");
    setNewIntakeYear("");
    setOpenAddPS(false);
  };

  const confirmAddPS = (e) => {
    e.preventDefault();
    let intakes = []
    standardPS.sort(function(a, b) {
      if(Number(a.intake.substring(a.intake.indexOf(' '))) !== Number(b.intake.substring(b.intake.indexOf(' ')))){
        return Number(a.intake.substring(a.intake.indexOf(' '))) - Number(b.intake.substring(b.intake.indexOf(' ')));
      }else{
        return ALL_MONTHS.indexOf(a.intake.substring(0, a.intake.indexOf(' '))) - ALL_MONTHS.indexOf(b.intake.substring(0, b.intake.indexOf(' ')));
      };
    }).map((item, index) => {
      intakes.push(item.intake);
    })
    if(intakes.includes(newIntakeMonth + " " + newIntakeYear)) {
      setSnackbarMsg(newIntakeMonth + " " + newIntakeYear + " existed.");
      setSnackbarSev("error");
      setOpenSnackbar(true);
      setNewIntakeMonth("");
      setNewIntakeYear("");
      setOpenAddPS(false);
    } else {
      let newIntakePS = {
        "intake": newIntakeMonth + " " + newIntakeYear,
        "PS": {
          "Software Engineering": [],
          "Data Science": [],
          "Game Development": [],
          "Cybersecurity": [],
        }
      };
      let currentPS = standardPS;
      currentPS.push(newIntakePS);
      setStandardPS(currentPS);
      // this.setState({standardPS: currentPS});
      axios
        .post(API_PATH + "/standardPS", {
          newPS: currentPS
        })
        .then((res) => {
          setSnackbarMsg("New Intake Added.");
          setSnackbarSev("success");
          setOpenSnackbar(true);
          setNewIntakeMonth("");
          setNewIntakeYear("");
          setOpenAddPS(false);
          // refresh
          // window.location.reload(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // Action: handle edit programme structure
  const handleActionEditPS = (e) => {
    e.preventDefault();
    let index = -1;
    for (let i = 0; i < standardPS.length; i++) {
      const element = standardPS[i];
      if(element.intake === selectedIntake) {
        index = i;
        break;
      }
    }
    setEditingPS(new Map(standardPS[index].PS[selectedSpec]));
    setTriSeq(standardPS[index].trimesterSeq);
    setStandardIndex(Number(index));
    setSelectionDisable(true);
    document.getElementById("psTable-container").style.display = "block";
  };

  // Action: close edit programme structure
  const handleActionCloseEditPS = (e) => {
    e.preventDefault();
    let emptyInputs = [
      {
        type: "",
        code: "",
        name: "",
        ch: "",
        offer: [],
        defaultTri: "",
      },
      {
        type: "",
        code: "",
        name: "",
        ch: "",
        offer: [],
        defaultTri: "",
      },
      {
        type: "",
        code: "",
        name: "",
        ch: "",
        offer: [],
        defaultTri: "",
      },
    ];
    setEditingPS(new Map());
    setTriSeq([]);
    setInputs(emptyInputs);
    setSelectionDisable(false);
    document.getElementById("psTable-container").style.display = "none";
  }

  // Action: handle copy programme structure
  const handleActionCopyPS = (event) => {
    event.preventDefault();
    setOpenCopyPS(true);
  };

  const handleCloseCopyPSDialog = (event) => {
    event.preventDefault();
    setNewIntakeMonth("");
    setNewIntakeYear("");
    setCopyFromIntake("");
    setOpenCopyPS(false);
  };

  const confirmCopyPS = () => {
    let copyOfSelectedPS;
    let intakes = []
    standardPS.sort(function(a, b) {
      if(Number(a.intake.substring(a.intake.indexOf(' '))) !== Number(b.intake.substring(b.intake.indexOf(' ')))){
        return Number(a.intake.substring(a.intake.indexOf(' '))) - Number(b.intake.substring(b.intake.indexOf(' ')));
      }else{
        return ALL_MONTHS.indexOf(a.intake.substring(0, a.intake.indexOf(' '))) - ALL_MONTHS.indexOf(b.intake.substring(0, b.intake.indexOf(' ')));
      };
    }).map((item, index) => {
      intakes.push(item.intake);
    })
    if(intakes.includes(newIntakeMonth + " " + newIntakeYear)) {
      setSnackbarMsg(newIntakeMonth + " " + newIntakeYear + " existed.");
      setSnackbarSev("error");
      setOpenSnackbar(true);
      setNewIntakeMonth("");
      setNewIntakeYear("");
      setOpenAddPS(false);
    } else {
      for (let i = 0; i < standardPS.length; i++) {
        const element = standardPS[i];
        if(element.intake === copyFromIntake) {
          copyOfSelectedPS = {
            "intake": newIntakeMonth + " " + newIntakeYear,
            "PS": element.PS
          };
          let copyStandard = JSON.parse(JSON.stringify(standardPS));
          copyStandard.push(copyOfSelectedPS);
          setStandardPS(copyStandard);
          axios
            .post(API_PATH + "/standardPS", {
              newPS: copyStandard
            })
            .then((res) => {
              setSnackbarMsg("Intake " + copyFromIntake + " Copied to " + newIntakeMonth + " " + newIntakeYear + ".");
              setSnackbarSev("success");
              setOpenSnackbar(true);
              setNewIntakeMonth("");
              setNewIntakeYear("");
              setCopyFromIntake("");
              setOpenAddPS(false);
              // refresh
              // window.location.reload(false);
            })
            .catch((err) => {
              console.log(err);
            });
            setOpenCopyPS(false);
          break;
        }
      }
    }
  };

  function compareMaps(map1, map2) {
    var testVal;
    if (map1.size !== map2.size) {
        return false;
    }
    for (var [key, val] of map1) {
        testVal = map2.get(key);
        // in cases of an undefined value, make sure the key
        // actually exists on the object so there are no false positives
        if (JSON.stringify(testVal) !== JSON.stringify(val) || (testVal === undefined && !map2.has(key))) {
            return false;
        }
    }
    return true;
  }

  return (
    <div>
      <Grid container spacing={3} className={classes.selectionCont}>
        <Grid item>
          <FormControl id="selection-intake" disabled={selectionDisable}>
            <Select
              style={{width: "200px"}}
              value={selectedIntake}
              onChange={(e) => {setSelectedIntake(e.target.value)}}
              displayEmpty
              className={classes.selectEmpty}
              renderValue={(selected) => {
                if (!selected) {
                  return <div style={{font: "inherit", color: "#aaa"}}>Intake</div>;
                }
    
                return selected;
              }}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {standardPS.sort(function(a, b) {
                if(Number(a.intake.substring(a.intake.indexOf(' '))) !== Number(b.intake.substring(b.intake.indexOf(' ')))){
                  return Number(a.intake.substring(a.intake.indexOf(' '))) - Number(b.intake.substring(b.intake.indexOf(' ')));
                }else{
                  return ALL_MONTHS.indexOf(a.intake.substring(0, a.intake.indexOf(' '))) - ALL_MONTHS.indexOf(b.intake.substring(0, b.intake.indexOf(' ')));
                };
              }).map((item, index) => {
                return (
                  <MenuItem value={item.intake}>{item.intake}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl disabled={selectionDisable}>
            <Select
              id="selection-spec"
              style={{width: "200px"}}
              value={selectedSpec}
              onChange={(e) => {setSelectedSpec(e.target.value)}}
              displayEmpty
              className={classes.selectEmpty}
              renderValue={(selected) => {
                if (!selected) {
                  return <div style={{font: "inherit", color: "#aaa"}}>Specialization</div>;
                }
    
                return selected;
              }}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value="Software Engineering">Software Engineering</MenuItem>
              <MenuItem value="Data Science">Data Science</MenuItem>
              <MenuItem value="Game Development">Game Development</MenuItem>
              <MenuItem value="Cybersecurity">Cybersecurity</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid>
          <SpeedDial
            ariaLabel="SpeedDial example"
            className={classes.speedDial}
            hidden={false}
            icon={<SpeedDialIcon />}
            onClose={handleCloseSpeedDial}
            onOpen={handleOpenSpeedDial}
            open={openSpeedDial}
            direction="down"
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                disabled={action.disabled}
                tooltipTitle={action.name}
                onClick={action.action}
              />
            ))}
          </SpeedDial>
        </Grid>
      </Grid>
      <Paper
        id="psTable-container"
        style={{ display: "none" }}
      >
        <TableContainer className={classes.table}>
          <Grid container spacing={3}>
            <Grid item xs>
                <span className={classes.seqCont}>
                  <h3>Trimester Sequence:
                  <Select
                    value={triSeq}
                    onChange={(e) => setTriSeq(e.target.value)}
                    displayEmpty
                    className={classes.seqSelect}
                    renderValue={(selected) => {
                      if (!selected) {
                        return <div style={{font: "inherit", color: "#aaa"}}>Category</div>;
                      }
          
                      return selected.toString();
                    }}
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value={[1, 2, 3]}>1, 2, 3</MenuItem>
                    <MenuItem value={[2, 3, 1]}>2, 3, 1</MenuItem>
                    <MenuItem value={[3, 1, 2]}>3, 1, 2</MenuItem>
                  </Select>
                  </h3>
                </span>
            </Grid>
            <Grid item xs />
          </Grid>
          {[0,1,2].map((yearIndex) => {
            return (
              <React.Fragment>
              <h1 className={classes.typoh1}>Year {yearIndex + 1}</h1>
              <Table
                className={classes.table}
                size="small"
                stickyHeader
                aria-label="caption table"
              >
                <caption>
                  <Grid container spacing={3} className={classes.gridContainer}>
                    <Grid item xs>
                      <FormControl className={classes.formControl}>
                        <Select
                          value={inputs[yearIndex].type}
                          onChange={(e) => onChange(e, yearIndex)}
                          name="type"
                          displayEmpty
                          className={classes.selectEmpty}
                          renderValue={(selected) => {
                            if (!selected) {
                              return <div style={{font: "inherit", color: "#aaa"}}>Category</div>;
                            }
                
                            return selected;
                          }}
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          <MenuItem value="core">Core</MenuItem>
                          <MenuItem value="elective">Elective</MenuItem>
                          <MenuItem value="mpu">MPU</MenuItem>
                          <MenuItem value="spec core">Specialization Core</MenuItem>
                          <MenuItem value="spec elec">Specialization Elective</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl className={classes.formControl}>
                        <Select
                          value={
                            (inputs[yearIndex].code) 
                              ? inputs[yearIndex].code + " - " 
                                + inputs[yearIndex].name + "  [" 
                                + inputs[yearIndex].ch + "]" 
                              : ""}
                          onChange={(e) => onChange(e, yearIndex)}
                          name="subject"
                          displayEmpty
                          className={classes.selectEmpty}
                          renderValue={(selected) => {
                            if (!selected) {
                              return <div style={{font: "inherit", color: "#aaa"}}>Subject</div>;
                            }
                
                            return selected;
                          }}
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          {Array.from(subjectList.entries()).map((entry) => {
                            const [key, value] = entry;
                            return (
                              <MenuItem key={key} value={entry}>{key + " - " + value.name + "  [" + value.ch + "]"}</MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs>
                      <FormControl className={classes.formControl}>
                        <Select
                          value={inputs[yearIndex].defaultTri}
                          onChange={(e) => onChange(e, yearIndex)}
                          name="defaultTri"
                          displayEmpty
                          className={classes.selectEmpty}
                          renderValue={(selected) => {
                            if (!selected) {
                              return <div style={{font: "inherit", color: "#aaa"}}>Default Trimester</div>;
                            }
                
                            return selected;
                          }}
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          {(inputs[yearIndex].offer)
                            ? inputs[yearIndex].offer.map((item, index) => {
                              return (
                                <MenuItem value={item}>{item}</MenuItem>
                              );
                            }) 
                            : <React.Fragment></React.Fragment>}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs>
                      <Button
                        className={classes.addBtn}
                        id="add-subject-button"
                        variant="contained"
                        onClick={(e) => {
                          handleAdd(e, yearIndex);
                        }}
                        color="primary"
                        // disabled={
                        //   (newCode && newSubject &&
                        //     newCode.match(/[A-Z]{3}[0-9]{4}/))
                        //     ? false : true
                        // }
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                </caption>
                <TableHead>
                  <TableRow>
                    <TableCell width="10%" align="center">
                      Category
                    </TableCell>
                    <TableCell width="15%" align="center">
                      Subject Code
                    </TableCell>
                    <TableCell width="40%" align="center">
                      Subject Name
                    </TableCell>
                    <TableCell width="10%" align="center">
                      CH
                    </TableCell>
                    <TableCell width="15%" align="center">
                      Default Trimester
                    </TableCell>
                    <TableCell width="10%" align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={classes.tableBody}>
                  {Array.from(editingPS.entries()).map((entry) => {
                    const [key, value] = entry;

                    if (value.defaultYear === yearIndex + 1) {
                      return (
                        <TableRow key={key}>
                          <TableCell align="center" component="th" scope="row">
                            {value.type}
                          </TableCell>
                          <TableCell align="center">{key}</TableCell>
                          <TableCell>{value.name}</TableCell>
                          <TableCell align="center">{value.ch}</TableCell>
                          <TableCell align="center">
                            {value.defaultTri}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              onClick={(e) => handleOpenDialog(e, key)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
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
          
        </TableContainer>
        <Tooltip title="Save Changes" aria-label="save">
          <Fab
            className={classes.saveBtn}
            color="primary"
            aria-label="save"
            disabled={((standardIndex) && standardPS[standardIndex])
              ? (compareMaps(editingPS, new Map(standardPS[standardIndex].PS[selectedSpec])) && 
                 JSON.stringify(standardPS[standardIndex].trimesterSeq)===JSON.stringify(triSeq))
               : true}
            onClick={handleSave}
          >
            <SaveIcon />
          </Fab>
        </Tooltip>
      </Paper>

      {/* Delete Subject From Programme Structure Confirmation Dialog */}
      <Dialog
        open={openDeletePSDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Remove subject?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to remove the subject?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Programme Structure Confirmation Dialog */}
      <Dialog
        open={openDeletePS}
        onClose={handleCloseDeletePSDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={"xs"}
      >
        <DialogTitle id="alert-dialog-title">
          Delete Programme Structure
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Select the intake and specialization to be deleted. Specialization is optional.
          </DialogContentText>
          <Select
            style={{width: "40%", marginRight: "5%"}}
            value={toDeleteIntake}
            onChange={(e) => {setToDeleteIntake(e.target.value)}}
            displayEmpty
            className={classes.selectEmpty}
            renderValue={(selected) => {
              if (!selected) {
                return <div style={{font: "inherit", color: "#aaa"}}>Intake</div>;
              }
  
              return selected;
            }}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {standardPS.sort(function(a, b) {
              if(Number(a.intake.substring(a.intake.indexOf(' '))) !== Number(b.intake.substring(b.intake.indexOf(' ')))){
                return Number(a.intake.substring(a.intake.indexOf(' '))) - Number(b.intake.substring(b.intake.indexOf(' ')));
              }else{
                return ALL_MONTHS.indexOf(a.intake.substring(0, a.intake.indexOf(' '))) - ALL_MONTHS.indexOf(b.intake.substring(0, b.intake.indexOf(' ')));
              };
            }).map((item, index) => {
              return (
                <MenuItem value={item.intake}>{item.intake}</MenuItem>
              );
            })}
          </Select>
          <Select
              id="delete-spec"
              style={{width: "55%"}}
              value={toDeleteSpec}
              onChange={(e) => {setToDeleteSpec(e.target.value)}}
              displayEmpty
              className={classes.selectEmpty}
              renderValue={(selected) => {
                if (!selected) {
                  return <div style={{font: "inherit", color: "#aaa"}}>Specialization</div>;
                }
    
                return selected;
              }}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value="" style={{color: "#aaa"}}><em>None</em></MenuItem>
              <MenuItem value="Software Engineering">Software Engineering</MenuItem>
              <MenuItem value="Data Science">Data Science</MenuItem>
              <MenuItem value="Game Development">Game Development</MenuItem>
              <MenuItem value="Cybersecurity">Cybersecurity</MenuItem>
            </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeletePSDialog} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={confirmDeletePS} color="primary" disabled={(toDeleteIntake) ? false : true}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Programme Structure Details */}
      <Dialog open={openAddPS} onClose={handleCloseAddPSDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add New Programme Structure</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select intake month and year
          </DialogContentText>
          <Select
            style={{width: "190px", marginRight: "20px"}}
            value={newIntakeMonth}
            onChange={(e) => {setNewIntakeMonth(e.target.value)}}
            displayEmpty
            className={classes.selectEmpty}
            renderValue={(selected) => {
              if (!selected) {
                return <div style={{font: "inherit", color: "#aaa"}}>Month</div>;
              }
  
              return selected;
            }}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {ALL_MONTHS.map((item) => {
              return <MenuItem value={item}>{item}</MenuItem>
            })}
            {/* <MenuItem value="January">January</MenuItem>
            <MenuItem value="February">February</MenuItem>
            <MenuItem value="March">March</MenuItem>
            <MenuItem value="April">April</MenuItem>
            <MenuItem value="May">May</MenuItem>
            <MenuItem value="June">June</MenuItem>
            <MenuItem value="July">July</MenuItem>
            <MenuItem value="August">August</MenuItem>
            <MenuItem value="September">September</MenuItem>
            <MenuItem value="October">October</MenuItem>
            <MenuItem value="November">November</MenuItem>
            <MenuItem value="December">December</MenuItem> */}
          </Select>
          <Select
            style={{width: "130px"}}
            value={newIntakeYear}
            onChange={(e) => {setNewIntakeYear(e.target.value)}}
            displayEmpty
            className={classes.selectEmpty}
            renderValue={(selected) => {
              if (!selected) {
                return <div style={{font: "inherit", color: "#aaa"}}>Year</div>;
              }
  
              return selected;
            }}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {years.map((item, index) => {
              return (
                <MenuItem value={item}>{item}</MenuItem>
              );
            })}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddPSDialog} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={confirmAddPS} disabled={(newIntakeMonth && newIntakeYear) ? false : true} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Copy Programme Structure Details Dialog */}
      <Dialog open={openCopyPS} onClose={handleCloseCopyPSDialog} aria-labelledby="form-dialog-title" maxWidth={"xs"}>
        <DialogTitle id="form-dialog-title">Copy Programme Structure</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select existing programme structure to copy from then select details for intake to copy to.
          </DialogContentText>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Select
                style={{width: "100%", marginRight: "20px"}}
                value={copyFromIntake}
                onChange={(e) => {setCopyFromIntake(e.target.value)}}
                displayEmpty
                className={classes.selectEmpty}
                renderValue={(selected) => {
                  if (!selected) {
                    return <div style={{font: "inherit", color: "#aaa"}}>Intake to copy from</div>;
                  }
      
                  return selected;
                }}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                {standardPS.sort(function(a, b) {
                  if(Number(a.intake.substring(a.intake.indexOf(' '))) !== Number(b.intake.substring(b.intake.indexOf(' ')))){
                    return Number(a.intake.substring(a.intake.indexOf(' '))) - Number(b.intake.substring(b.intake.indexOf(' ')));
                  }else{
                    return ALL_MONTHS.indexOf(a.intake.substring(0, a.intake.indexOf(' '))) - ALL_MONTHS.indexOf(b.intake.substring(0, b.intake.indexOf(' ')));
                  };
                }).map((item, index) => {
                  return (
                    <MenuItem value={item.intake}>{item.intake}</MenuItem>
                  );
                })}
              </Select>
            </Grid>
            <Grid item xs={3}>
              <Select
                style={{width: "100%", marginRight: "20px"}}
                value={newIntakeMonth}
                onChange={(e) => {setNewIntakeMonth(e.target.value)}}
                displayEmpty
                className={classes.selectEmpty}
                renderValue={(selected) => {
                  if (!selected) {
                    return <div style={{font: "inherit", color: "#aaa"}}>Month</div>;
                  }
      
                  return selected;
                }}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                {ALL_MONTHS.map((item) => {
                  return <MenuItem value={item}>{item}</MenuItem>
                })}
                {/* <MenuItem value="January">January</MenuItem>
                <MenuItem value="February">February</MenuItem>
                <MenuItem value="March">March</MenuItem>
                <MenuItem value="April">April</MenuItem>
                <MenuItem value="May">May</MenuItem>
                <MenuItem value="June">June</MenuItem>
                <MenuItem value="July">July</MenuItem>
                <MenuItem value="August">August</MenuItem>
                <MenuItem value="September">September</MenuItem>
                <MenuItem value="October">October</MenuItem>
                <MenuItem value="November">November</MenuItem>
                <MenuItem value="December">December</MenuItem> */}
              </Select>
            </Grid>
            <Grid item xs={3}>
              <Select
                style={{width: "100%"}}
                value={newIntakeYear}
                onChange={(e) => {setNewIntakeYear(e.target.value)}}
                displayEmpty
                className={classes.selectEmpty}
                renderValue={(selected) => {
                  if (!selected) {
                    return <div style={{font: "inherit", color: "#aaa"}}>Year</div>;
                  }
      
                  return selected;
                }}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                {years.map((item, index) => {
                  return (
                    <MenuItem value={item}>{item}</MenuItem>
                  );
                })}
              </Select>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCopyPSDialog} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={confirmCopyPS} disabled={(newIntakeMonth && newIntakeYear) ? false : true} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSev}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </div>
  );
}
