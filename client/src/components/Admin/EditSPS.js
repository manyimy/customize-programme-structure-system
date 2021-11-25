import React from "react";
import { withStyles } from "@material-ui/core/styles";

import MuiAlert from "@material-ui/lab/Alert";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { ButtonGroup } from "@material-ui/core";
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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = withStyles((theme) => ({
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
    position: "absolute",
    // position: 'fixed',
    // '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
    //   bottom: theme.spacing(5),
    //   right: theme.spacing(5),
    // },
    // '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
    //   top: theme.spacing(5),
    //   left: theme.spacing(5),
    // },
    // zIndex: 10
  },
}));

export default useStyles(
  class EditSPS extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        years: [],
        // trimesters: [],
        subjectList: [],
        selectionDisable: false,    // disable initial selection of intake and spec
        openSaveBtn: false,   // save programme structure button visibility
        openSnackbar: false,  // snackbar visibility
        snackbarMsg: "",      // snackbar message
        snackbarSev: "error", // snackbar severity
        openDeletePSDialog: false,    // open confirmation dialog
        openSpeedDial: false, // open speed dial all actions
        toDeleteSubject: -99,        // index of subject to delete
        selectedIntake: "",   // initial selection intake
        selectedSpec: "",     // initial selection specialization
        standardPS: [],       // standard programme structure from server JSON file
        standardIndex: "",
        // tri1PS: [],           // old
        // tri2PS: [],           // old
        // tri3PS: [],           // old
        editingPS: [],        // current editting programme structure (old)
        inputs: [
          {
            type: "",
            code: "",
            name: "",
            ch: "",
            subject: "",
            defaultTri: "",
          },
          {
            type: "",
            code: "",
            name: "",
            ch: "",
            subject: "",
            defaultTri: "",
          },
          {
            type: "",
            code: "",
            name: "",
            ch: "",
            subject: "",
            defaultTri: "",
          },
        ],
        openAddPS: false,
        openCopyPS: false, 
        newIntakeMonth: "",       // month of new intake to be created
        newIntakeYear: "",        // year of new intake to be created
        copyFromIntake: "",       // intake to be copy from
        toDeleteIntake: "",       // programme structure of intake to be deleted
        toDeleteSpec: ""          // programme structure of specification to be deleted
      };
    }

    componentDidMount() {
      axios.get(API_PATH + "/subjectList.json").then((response) => {
        this.setState({
          subjectList: response.data,
        });
        console.log(response.data);
      });
      
      axios.get(API_PATH + "/standardPS.json").then((response) => {
        console.log(response.data);
        this.setState({
          standardPS: response.data,
        });
      });

      let thisYear = (new Date()).getFullYear();
      let years = [];
      for(let i = thisYear-1; years.length <= 5; i++) {
        years.push(i);
      }
      this.setState({years});
    }

    render() {
      const { classes } = this.props;

      // Speed dial tooltips
      const actions = [
        { icon: <AddIcon />, name: 'Add', action: (e) => handleActionAddPS(e), disabled: this.state.selectionDisable },
        { icon: <FileCopyIcon />, name: 'Copy', action: (e) => handleActionCopyPS(e), disabled: this.state.selectionDisable },
        { icon: (!this.state.selectionDisable) ? <EditIcon /> : <CloseIcon />, name: (!this.state.selectionDisable) ? 'Edit' : 'Close', 
                action: (e) => (!this.state.selectionDisable) ? handleActionEditPS(e) : handleActionCloseEditPS(e),
                disabled: (this.state.selectedIntake && this.state.selectedSpec) ? false : true 
        },
        // { icon: <SaveIcon />, name: 'Save', action: (e) => handleSave(e), disabled: !this.state.selectionDisable },
        { icon: <DeleteIcon />, name: 'Delete', action: (e) => handleActionDeletePS(e), disabled: this.state.selectionDisable },
      ];

      const handleCloseSnackbar = () => {
        this.setState({
          snackbarMsg: "",
          snackbarSev: "",
          openSnackbar: false,
        });
      };

      // onchange input new subjects 
      const onChange = (e, year) => {
        let { name, value } = e.target;
        this.setState((prevState, props) => ({
          inputs: [
            ...prevState.inputs.slice(0, year),
            {
              ...prevState.inputs[year],
              [name]: (name === "ch" || name === "defaultTri") ? Number(value) : value,
            },
            ...prevState.inputs.slice(year + 1),
          ],
        }));
        if(name === "subject") {
          // console.log(value.substring());
          // console.log(this.state.subjectList[key].code);
          this.setState((prevState, props) => ({
            inputs: [
              ...prevState.inputs.slice(0, year),
              {
                ...prevState.inputs[year],
                code: value.substring(0, value.indexOf(" - ")),
                name: value.substring(value.indexOf(" - ") + 3, value.indexOf(" [") - 1),
                ch: Number(value.substring(value.length - 2, value.length - 1)),
              },
              ...prevState.inputs.slice(year + 1),
            ],
          }));
        }
        console.log(this.state.inputs);
      };

      // on select intake and specialization
      const onChangeSelection = (e) => {
        let { name, value } = e.target;
        this.setState({
          [name]: value
        });
      };

      // Confirmation dialog for delete subject from programme structure
      const handleOpenDialog = (event, index) => {
        event.preventDefault();
        this.setState({
          toDeleteSubject: index,
          openDeletePSDialog: true,
        });
      };

      const handleCloseDialog = (event) => {
        event.preventDefault();
        this.setState({
          toDeleteSubject: null,
          openDeletePSDialog: false,
        });
      };

      // handle add subject to programme structure
      const handleAdd = (e, year) => {
        e.preventDefault();
        if (
          !this.state.inputs[year].subject ||
          !this.state.inputs[year].defaultTri
        ) {
          this.setState({
            snackbarMsg:
              "Subject and default trimesters cannot be empty.",
            snackbarSev: "error",
            openSnackbar: true,
          });
        } else {
          let updatePS = this.state.editingPS;
          console.log(updatePS);
          updatePS.push({
            key: (updatePS.length === 0) ? 1 : updatePS[updatePS.length - 1].key + 1,
            code: this.state.inputs[year].code,
            name: this.state.inputs[year].name,
            ch: Number(this.state.inputs[year].ch),
            type: this.state.inputs[year].type,
            defaultTri: Number(this.state.inputs[year].defaultTri),
            defaultYear: year + 1,
          });
          // this.setState({editingPS: updatePS});
          console.log(year);
          console.log(this.state.inputs);
          this.setState((prevState, props) => ({
            inputs: [
              ...prevState.inputs.slice(0, year),
              {
                type: "",
                code: "",
                name: "",
                ch: "",
                subject: "",
                defaultTri: "",
              },
              ...prevState.inputs.slice(year + 1),
            ],
            editingPS: JSON.parse(JSON.stringify(updatePS)),
          }));
        }
      };

      // handle delete subject from programme structure
      const handleDelete = (e) => {
        let arrayCopy = this.state.editingPS;
        arrayCopy.splice(this.state.toDeleteSubject, 1);
        this.setState({
          editingPS: JSON.parse(JSON.stringify(arrayCopy)),
          snackbarMsg: "Subject removed.",
          snackbarSev: "success",
          openSnackbar: true,
        });
        handleCloseDialog(e);
      };

      // handle save modified programme structure
      const handleSave = (e) => {
        e.preventDefault();
        let copyStandard = JSON.parse(JSON.stringify(this.state.standardPS));
        for (let i = 0; i < this.state.standardPS.length; i++) {
          const element = this.state.standardPS[i];
          if(this.state.selectedIntake === element.intake) {
            copyStandard[i].PS[this.state.selectedSpec] = this.state.editingPS;
            break;
          }
        }
        this.setState({
          standardPS: JSON.parse(JSON.stringify(copyStandard)),
          selectionDisable: false
        });
        let emptyInputs = [
          {
            type: "",
            code: "",
            name: "",
            ch: "",
            subject: "",
            defaultTri: "",
          },
          {
            type: "",
            code: "",
            name: "",
            ch: "",
            subject: "",
            defaultTri: "",
          },
          {
            type: "",
            code: "",
            name: "",
            ch: "",
            subject: "",
            defaultTri: "",
          },
        ];
        axios
          .post(API_PATH + "/standardPS", {
            newPS: copyStandard,
          })
          .then((res) => {
            this.setState({
              snackbarMsg: "Updated Successfully.",
              snackbarSev: "success",
              openSnackbar: true,
              // selectedIntake: "",
              // selectedSpec: "",
              inputs: emptyInputs
            });
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
        this.setState({openSpeedDial: false});
      };
      
      const handleOpenSpeedDial = () => {
        this.setState({openSpeedDial: true});
      };

      // Action: Delete Selected Programme Structure
      const handleActionDeletePS = (e) => {
        e.preventDefault();
        this.setState({
          openDeletePS: true
        });
      };

      const handleCloseDeletePSDialog = (event) => {
        event.preventDefault();
        this.setState({
          toDeleteSpec: "",
          toDeleteIntake: "",
          openDeletePS: false,
        });
      };

      const confirmDeletePS = () => {
        // let toDeletePS = this.state.selectedIntake;
        this.setState({
          selectedSpec: "",
          selectedIntake: ""
        });
        let temp = JSON.parse(JSON.stringify(this.state.standardPS));
        if(!this.state.toDeleteSpec) {
          for (let i = 0; i < this.state.standardPS.length; i++) {
            const ps = this.state.standardPS[i];
            if(ps.intake === this.state.toDeleteIntake) {
              temp.splice(i, 1);
              break;
            }
          }
        } else {
          for (let i = 0; i < this.state.standardPS.length; i++) {
            const ps = this.state.standardPS[i];
            if(ps.intake === this.state.toDeleteIntake) {
              temp[i].PS[this.state.toDeleteSpec] = [];
              break;
            }
          }
        }
        this.setState({
          standardPS: JSON.parse(JSON.stringify(temp))
        });
          axios
            .post(API_PATH + "/standardPS", {
              newPS: temp
            })
            .then((res) => {
              this.setState({
                snackbarMsg: this.state.toDeleteIntake + ((this.state.toDeleteSpec) ? ( " " + this.state.toDeleteSpec) : "") + " has been deleted.",
                snackbarSev: "success",
                openSnackbar: true,
                toDeleteSpec: "",
                toDeleteIntake: ""
              });
              // refresh
              // window.location.reload(false);~
            })
            .catch((err) => {
              console.log(err);
            });
        this.setState({openDeletePS: false});
      };

      // Action: Add New Programme Structure
      const handleActionAddPS = (e) => {
        e.preventDefault();
        this.setState({
          openAddPS: true,
        })
      };

      const handleCloseAddPSDialog = (event) => {
        event.preventDefault();
        this.setState({
          newIntakeMonth: "",
          newIntakeYear: "",
          openAddPS: false,
        });
      };

      const confirmAddPS = (e) => {
        e.preventDefault();
        let intakes = []
        this.state.standardPS.map((item, index) => {
          intakes.push(item.intake);
        })
        if(intakes.includes(this.state.newIntakeMonth + " " + this.state.newIntakeYear)) {
          this.setState({
            snackbarMsg: this.state.newIntakeMonth + " " + this.state.newIntakeYear + " existed.",
            snackbarSev: "error",
            openSnackbar: true,
            newIntakeMonth: "",
            newIntakeYear: "",
            openAddPS: false,
          });
        } else {
          let newIntakePS = {
            "intake": this.state.newIntakeMonth + " " + this.state.newIntakeYear,
            "PS": {
              "Software Engineering": [],
              "Data Science": [],
              "Game Development": [],
              "Cybersecurity": [],
            }
          };
          let currentPS = this.state.standardPS;
          currentPS.push(newIntakePS);
          this.setState({standardPS: currentPS});
          axios
            .post(API_PATH + "/standardPS", {
              newPS: currentPS
            })
            .then((res) => {
              this.setState({
                snackbarMsg: "New Intake Added.",
                snackbarSev: "success",
                openSnackbar: true,
                newIntakeMonth: "",
                newIntakeYear: "",
                openAddPS: false,
              });
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
        let index = -9;
        for (let i = 0; i < this.state.standardPS.length; i++) {
          const element = this.state.standardPS[i];
          if(element.intake === this.state.selectedIntake) {
            index = i;
            console.log("found " + i);
            break;
          }
        }
        console.log(this.state.standardPS[index]);
        console.log(this.state.standardPS[index].PS[this.state.selectedSpec]);
        let toEditPS = this.state.standardPS[index].PS[this.state.selectedSpec];
        console.log(toEditPS);
        this.setState({
          editingPS: toEditPS,
          standardIndex: Number(index),
          selectionDisable: true
        })
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
            subject: "",
            defaultTri: "",
          },
          {
            type: "",
            code: "",
            name: "",
            ch: "",
            subject: "",
            defaultTri: "",
          },
          {
            type: "",
            code: "",
            name: "",
            ch: "",
            subject: "",
            defaultTri: "",
          },
        ];
        this.setState({
          editingPS: [],
          // selectedIntake: "",
          // selectedSpec: "",
          inputs: emptyInputs,
          selectionDisable: false
        })
        document.getElementById("psTable-container").style.display = "none";
      }

      // Action: handle copy programme structure

      const handleActionCopyPS = (e) => {
        e.preventDefault();
        this.setState({
          openCopyPS: true,
        })
      };

      const handleCloseCopyPSDialog = (event) => {
        event.preventDefault();
        this.setState({
          newIntakeMonth: "",
          newIntakeYear: "",
          copyFromIntake: "",
          openCopyPS: false,
        });
      };

      const confirmCopyPS = () => {
        let copyOfSelectedPS;
        let intakes = []
        this.state.standardPS.map((item, index) => {
          intakes.push(item.intake);
        })
        if(intakes.includes(this.state.newIntakeMonth + " " + this.state.newIntakeYear)) {
          this.setState({
            snackbarMsg: this.state.newIntakeMonth + " " + this.state.newIntakeYear + " existed.",
            snackbarSev: "error",
            openSnackbar: true,
            newIntakeMonth: "",
            newIntakeYear: "",
            copyFromIntake: "",
            openAddPS: false,
          });
        } else {
          for (let i = 0; i < this.state.standardPS.length; i++) {
            const element = this.state.standardPS[i];
            if(element.intake === this.state.copyFromIntake) {
              copyOfSelectedPS = {
                "intake": this.state.newIntakeMonth + " " + this.state.newIntakeYear,
                "PS": element.PS
              };
              let copyStandard = JSON.parse(JSON.stringify(this.state.standardPS));
              console.log(copyStandard);
              copyStandard.push(copyOfSelectedPS);
              console.log(copyStandard);
              this.setState({standardPS: copyStandard});
              axios
                .post(API_PATH + "/standardPS", {
                  newPS: copyStandard
                })
                .then((res) => {
                  this.setState({
                    snackbarMsg: "Intake " + this.state.copyFromIntake + " Copied to " + this.state.newIntakeMonth + " " + this.state.newIntakeYear + ".",
                    snackbarSev: "success",
                    openSnackbar: true,
                    newIntakeMonth: "",
                    newIntakeYear: "",
                    copyFromIntake: "",
                    openAddPS: false,
                  });
                  // refresh
                  // window.location.reload(false);
                })
                .catch((err) => {
                  console.log(err);
                });
              this.setState({openCopyPS: false});
              break;
            }
          }
        }
      };

      return (
        <div>
          <Grid container spacing={3} className={classes.selectionCont}>
            <Grid item>
              <FormControl id="selection-intake" disabled={this.state.selectionDisable}>
                <Select
                  style={{width: "200px"}}
                  value={this.state.selectedIntake}
                  onChange={onChangeSelection}
                  name="selectedIntake"
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
                  {this.state.standardPS.map((item, index) => {
                    return (
                      <MenuItem value={item.intake}>{item.intake}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl disabled={this.state.selectionDisable}>
                <Select
                  id="selection-spec"
                  style={{width: "200px"}}
                  value={this.state.selectedSpec}
                  onChange={onChangeSelection}
                  name="selectedSpec"
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
                open={this.state.openSpeedDial}
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
            style={{ display: this.state.selectedTri ? "block" : "none" }}
          >
            <TableContainer className={classes.table}>
              <h1 className={classes.typoh1}>Year 1</h1>
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
                          value={this.state.inputs[0].type}
                          onChange={(e) => onChange(e, 0)}
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
                          value={this.state.inputs[0].subject}
                          onChange={(e) => onChange(e, 0)}
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
                          {this.state.subjectList.map((item, index) => {
                            return (
                              <MenuItem value={item.code + " - " + item.name + "  [" + item.ch + "]"}>{item.code + " - " + item.name + "  [" + item.ch + "]"}</MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs>
                      <FormControl className={classes.formControl}>
                        <Select
                          value={this.state.inputs[0].defaultTri}
                          onChange={(e) => onChange(e, 0)}
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
                          <MenuItem value="1">1</MenuItem>
                          <MenuItem value="2">2</MenuItem>
                          <MenuItem value="3">3</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs>
                      <Button
                        className={classes.addBtn}
                        id="add-subject-button"
                        variant="contained"
                        onClick={(e) => {
                          handleAdd(e, 0);
                        }}
                        color="primary"
                        // disabled={
                        //   (this.state.newCode && this.state.newSubject &&
                        //     this.state.newCode.match(/[A-Z]{3}[0-9]{4}/))
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
                  {this.state.editingPS.map((item, index) => {
                    if (item.defaultYear === 1) {
                      return (
                        <TableRow key={item.key}>
                          <TableCell align="center" component="th" scope="row">
                            {item.type}
                          </TableCell>
                          <TableCell align="center">{item.code}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="center">{item.ch}</TableCell>
                          <TableCell align="center">
                            {item.defaultTri}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              onClick={(e) => handleOpenDialog(e, index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    } else {
                      return <></>;
                    }
                  })}
                </TableBody>
              </Table>

              <h1 className={classes.typoh1}>Year 2</h1>
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
                          value={this.state.inputs[1].type}
                          onChange={(e) => onChange(e, 1)}
                          name="type"
                          displayEmpty
                          renderValue={(selected) => {
                            if (!selected) {
                              return <div style={{font: "inherit", color: "#aaa"}}>Category</div>;
                            }
                
                            return selected;
                          }}
                          className={classes.selectEmpty}
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
                          value={this.state.inputs[1].subject}
                          onChange={(e) => onChange(e, 1)}
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
                          {this.state.subjectList.map((item, index) => {
                            return (
                              <MenuItem value={item.code + " - " + item.name + "  [" + item.ch + "]"}>{item.code + " - " + item.name + "  [" + item.ch + "]"}</MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs>
                      <FormControl className={classes.formControl}>
                        <Select
                          value={this.state.inputs[1].defaultTri}
                          onChange={(e) => onChange(e, 1)}
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
                          <MenuItem value="1">1</MenuItem>
                          <MenuItem value="2">2</MenuItem>
                          <MenuItem value="3">3</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs>
                      <Button
                        className={classes.addBtn}
                        id="add-subject-button"
                        variant="contained"
                        onClick={(e) => {
                          handleAdd(e, 1);
                        }}
                        color="primary"
                        // disabled={
                        //   (this.state.newCode && this.state.newSubject &&
                        //     this.state.newCode.match(/[A-Z]{3}[0-9]{4}/))
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
                  {this.state.editingPS.map((item, index) => {
                    if (item.defaultYear === 2) {
                      return (
                        <TableRow key={item.key}>
                          <TableCell align="center" component="th" scope="row">
                            {item.type}
                          </TableCell>
                          <TableCell align="center">{item.code}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="center">{item.ch}</TableCell>
                          <TableCell align="center">
                            {item.defaultTri}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              onClick={(e) => handleOpenDialog(e, index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    } else {
                      return <></>;
                    }
                  })}
                </TableBody>
              </Table>

              <h1 className={classes.typoh1}>Year 3</h1>
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
                          value={this.state.inputs[2].type}
                          onChange={(e) => onChange(e, 2)}
                          name="type"
                          displayEmpty
                          renderValue={(selected) => {
                            if (!selected) {
                              return <div style={{font: "inherit", color: "#aaa"}}>Category</div>;
                            }
                
                            return selected;
                          }}
                          className={classes.selectEmpty}
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
                          value={this.state.inputs[2].subject}
                          onChange={(e) => onChange(e, 2)}
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
                          {this.state.subjectList.map((item, index) => {
                            return (
                              <MenuItem value={item.code + " - " + item.name + "  [" + item.ch + "]"}>{item.code + " - " + item.name + "  [" + item.ch + "]"}</MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs>
                      <FormControl className={classes.formControl}>
                        <Select
                          value={this.state.inputs[2].defaultTri}
                          onChange={(e) => onChange(e, 2)}
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
                          <MenuItem value="1">1</MenuItem>
                          <MenuItem value="2">2</MenuItem>
                          <MenuItem value="3">3</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs>
                      <Button
                        className={classes.addBtn}
                        id="add-subject-button"
                        variant="contained"
                        onClick={(e) => {
                          handleAdd(e, 2);
                        }}
                        color="primary"
                        // disabled={
                        //   (this.state.newCode && this.state.newSubject &&
                        //     this.state.newCode.match(/[A-Z]{3}[0-9]{4}/))
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
                  {this.state.editingPS.map((item, index) => {
                    if (item.defaultYear === 3) {
                      return (
                        <TableRow key={item.key}>
                          <TableCell align="center" component="th" scope="row">
                            {item.type}
                          </TableCell>
                          <TableCell align="center">{item.code}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="center">{item.ch}</TableCell>
                          <TableCell align="center">
                            {item.defaultTri}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              onClick={(e) => handleOpenDialog(e, index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    } else {
                      return <></>;
                    }
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Tooltip title="Save Changes" aria-label="save">
              <Fab
                className={classes.saveBtn}
                color="primary"
                aria-label="save"
                disabled={((this.state.standardIndex) && this.state.standardPS[this.state.standardIndex])
                  ? (this.state.editingPS === this.state.standardPS[this.state.standardIndex].PS[this.state.selectedSpec])
                      ? true : false : true}
                onClick={handleSave}
              >
                <SaveIcon />
              </Fab>
            </Tooltip>
          </Paper>

          {/* Delete Subject From Programme Structure Confirmation Dialog */}
          <Dialog
            open={this.state.openDeletePSDialog}
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
            open={this.state.openDeletePS}
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
                value={this.state.toDeleteIntake}
                onChange={onChangeSelection}
                name="toDeleteIntake"
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
                {this.state.standardPS.map((item, index) => {
                  return (
                    <MenuItem value={item.intake}>{item.intake}</MenuItem>
                  );
                })}
              </Select>
              <Select
                  id="delete-spec"
                  style={{width: "55%"}}
                  value={this.state.toDeleteSpec}
                  onChange={onChangeSelection}
                  name="toDeleteSpec"
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
              <Button onClick={confirmDeletePS} color="primary" disabled={(this.state.toDeleteIntake) ? false : true}>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
          
          {/* Add Programme Structure Details */}
          <Dialog open={this.state.openAddPS} onClose={handleCloseAddPSDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add New Programme Structure</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Select intake month and year
              </DialogContentText>
              <Select
                style={{width: "190px", marginRight: "20px"}}
                value={this.state.newIntakeMonth}
                onChange={onChangeSelection}
                name="newIntakeMonth"
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
                <MenuItem value="January">January</MenuItem>
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
                <MenuItem value="December">December</MenuItem>
              </Select>
              <Select
                style={{width: "130px"}}
                value={this.state.newIntakeYear}
                onChange={onChangeSelection}
                name="newIntakeYear"
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
                {this.state.years.map((item, index) => {
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
              <Button onClick={confirmAddPS} disabled={(this.state.newIntakeMonth && this.state.newIntakeYear) ? false : true} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          {/* Copy Programme Structure Details Dialog */}
          <Dialog open={this.state.openCopyPS} onClose={handleCloseCopyPSDialog} aria-labelledby="form-dialog-title" maxWidth={"xs"}>
            <DialogTitle id="form-dialog-title">Copy Programme Structure</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Select existing programme structure to copy from then select details for intake to copy to.
              </DialogContentText>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Select
                    style={{width: "100%", marginRight: "20px"}}
                    value={this.state.copyFromIntake}
                    onChange={onChangeSelection}
                    name="copyFromIntake"
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
                    {this.state.standardPS.map((item, index) => {
                      return (
                        <MenuItem value={item.intake}>{item.intake}</MenuItem>
                      );
                    })}
                  </Select>
                </Grid>
                <Grid item xs={3}>
                  <Select
                    style={{width: "100%", marginRight: "20px"}}
                    value={this.state.newIntakeMonth}
                    onChange={onChangeSelection}
                    name="newIntakeMonth"
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
                    <MenuItem value="January">January</MenuItem>
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
                    <MenuItem value="December">December</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={3}>
                  <Select
                    style={{width: "100%"}}
                    value={this.state.newIntakeYear}
                    onChange={onChangeSelection}
                    name="newIntakeYear"
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
                    {this.state.years.map((item, index) => {
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
              <Button onClick={confirmCopyPS} disabled={(this.state.newIntakeMonth && this.state.newIntakeYear) ? false : true} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={this.state.openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={this.state.snackbarSev}
            >
              {this.state.snackbarMsg}
            </Alert>
          </Snackbar>
        </div>
      );
    }
  }
);
