import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import MuiAlert from '@material-ui/lab/Alert';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import SaveIcon from '@material-ui/icons/Save';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';

import axios from 'axios';
const API_PATH = process.env.REACT_APP_API_PATH;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = withStyles((theme) => ({
  root: {

  },
  tableCont: {
    // display: "none",
  },
  table: {
    width: "70vw",
    marginLeft: "auto",
    marginRight: "auto",
    overflowX: "visible"
  },
  tableBody: {
    overflowY: "scroll",
  },
  btnGrpCont: {
    textAlign: "center",
    marginBottom: "20px",
  },
  typoh1: {
    textAlign: "center"
  },
  gridContainer: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  codeInput: {
    marginRight: "20px",
  },
  addBtn: {
    float: "right"
  },
  saveBtn: {
    float: "right",
    position: "fixed",
    bottom: "3vh",
    right: "3vw",
  }
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

export default useStyles(class EditSPS extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      psList: [],
      trimesters: [],
      openSaveBtn: false,
      openSnackbar: false,
      snackbarMsg: '',
      snackbarSev: 'error',
      openDialog: false,
      toDelete: null,
      selectedTri: null,
      tri1PS: [],
      tri2PS: [],
      tri3PS: [],
      editingPS: [],
      inputs: [
        {
          type: null,
          code: null,
          subject: null,
          ch: null,
          defaultTri: null,
        },
        {
          type: null,
          code: null,
          subject: null,
          ch: null,
          defaultTri: null,
        },
        {
          type: null,
          code: null,
          subject: null,
          ch: null,
          defaultTri: null,
        },
      ]
    }
  }

  componentDidMount() {
    axios.get( API_PATH + "/trimesters.json")
      .then((response) => {
        this.setState({
          trimesters: response.data
        });
      });
    for(let i = 1; i < 4; i++){
      let name = "tri" + i + "PS";
      axios.get( API_PATH + "/" + name + ".json")
        .then((ps) => {
          console.log(ps.data);
          this.setState({
            [name]: ps.data
          });
        }).catch((err) => {
          console.log(err);
        });
    }
  }
  
  render(){
    const { classes } = this.props;

    const handleCloseSnackbar = () => {
      this.setState({
        snackbarMsg: '',
        snackbarSev: '',
        openSnackbar: false
      });
    };

    const onChange = (e, year) => {
      let { name, value } = e.target;
      this.setState((prevState, props) => ({
        inputs: [
          ...prevState.inputs.slice(0, year),
          { 
            ...prevState.inputs[year],
            [name]: value
          },
          ...prevState.inputs.slice(year + 1),
        ]
      }));
    }

    const onClickTriBtns = (e, index) => {
      e.preventDefault();
      let selectedTriPS = (index === 1) ? this.state.tri1PS 
                          : (index === 2) ? this.state.tri2PS 
                            : this.state.tri3PS;
      this.setState({
        selectedTri: index,
        editingPS: JSON.parse(JSON.stringify(selectedTriPS)),
        openSaveBtn: true
      });
  
      this.setState({selectedTri: index});
      // document.getElementById("psTable-container").style.display = "block";
    }

    const handleOpenDialog = (event, index) => {
      event.preventDefault();
      this.setState({
        toDelete: index,
        openDialog: true
      });
    }

    const handleCloseDialog = (event) => {
      event.preventDefault();
      this.setState({
        toDelete: null,
        openDialog: false
      });
    }

    const handleAdd = (e, year) => {
      e.preventDefault();
      if(!this.state.inputs[year].subject || !this.state.inputs[year].ch ||
        !this.state.inputs[year].defaultTri) {
        this.setState({
          snackbarMsg: 'Subject name, credit hours and default trimesters cannot be empty.',
          snackbarSev: 'error',
          openSnackbar: true
        });
      } else if(this.state.inputs[year].ch === 0) {
        this.setState({
          snackbarMsg: 'Credit hours cannot be zero.',
          snackbarSev: 'error',
          openSnackbar: true
        });
      } else {
        let updatePS = this.state.editingPS;
        updatePS.push({
          "key": updatePS[updatePS.length-1].key + 1,
          "code": this.state.inputs[year].code,
          "subject": this.state.inputs[year].subject,
          "ch": Number(this.state.inputs[year].ch),
          "type": this.state.inputs[year].type,
          "defaultTri": Number(this.state.inputs[year].defaultTri),
          "defaultYear": year + 1
        })
        // this.setState({editingPS: updatePS});
        console.log(year);
        console.log(this.state.inputs);
        this.setState((prevState, props) => ({
          inputs: [
            ...prevState.inputs.slice(0, year),
            { 
              type: "",
              code: "",
              subject: "",
              ch: "",
              defaultTri: "",
            },
            ...prevState.inputs.slice(year + 1),
          ],
          editingPS: JSON.parse(JSON.stringify(updatePS))
        }));
      }
    }

    const handleDelete = (e) => {
      let arrayCopy = this.state.editingPS;
      arrayCopy.splice(this.state.toDelete, 1);
      this.setState({editingPS: JSON.parse(JSON.stringify(arrayCopy))});
      handleCloseDialog(e);
    }

    const handleSave = () => {
      axios.post(API_PATH + '/updatePS',{
        tri: this.state.selectedTri,
        ps: this.state.editingPS
      }).then((res) => {
        this.setState({
          snackbarMsg: 'Updated Successfully.',
          snackbarSev: 'success',
          openSnackbar: true,
          selectedTri: null
        });
        window.location.reload(false);
      }).catch((err) => {
        console.log(err);
      });
    }

    return (
      <div className={classes.root}>
        <div className={classes.btnGrpCont}>
          <ButtonGroup aria-label="outlined primary button group">
            {this.state.trimesters.map((item, index) => {
              return(
                <Button
                  variant={(this.state.selectedTri === index+1) ? "contained" : "outlined"}
                  color="primary"
                  onClick={(e) => {onClickTriBtns(e, index + 1)}}
                >{ "Trimester " + (index + 1) }
                </Button>
              );
            })}
          </ButtonGroup>
        </div>
        <Paper id="psTable-container" className={classes.tableCont} style={{display: (this.state.selectedTri) ? "block" : "none"}}>
          <TableContainer className={classes.table}>
            <h1 className={classes.typoh1}>Year 1</h1>
            <Table className={classes.table} size="small" stickyHeader aria-label="caption table">
              <caption>
                <Grid container spacing={3} className={classes.gridContainer}>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="category"
                      placeholder="Category"
                      onChange={(e) => onChange(e, 0)}
                      value={this.state.inputs[0].type}
                      name="type"
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      className={classes.codeInput}
                      margin="dense"
                      id="code"
                      placeholder="Subject Code"
                      inputProps={{ maxLength: 7 }}
                      // error= {(e) => (e.target.value.match(/[A-Z]{3}[0-9]{4}/)) ? false : true}
                      onChange={(e) => onChange(e, 0)}
                      // helperText={(e) => (e.target.value.match(/[A-Z]{3}[0-9]{4}/)) ? "" : "Invalid format: ABC1234"}
                      value={this.state.inputs[0].code}
                      name="code"
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="name"
                      placeholder="Subject Name"
                      onChange={(e) => onChange(e, 0)}
                      value={this.state.inputs[0].subject}
                      name="subject"
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="ch"
                      placeholder="Credit Hour"
                      type="number"
                      onChange={(e) => onChange(e, 0)}
                      value={this.state.inputs[0].ch}
                      name="ch"
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="defaultTri"
                      placeholder="Default Trimester"
                      type="number"
                      onChange={(e) => onChange(e, 0)}
                      value={this.state.inputs[0].defaultTri}
                      name="defaultTri"
                    />
                  </Grid>
                  <Grid item xs>
                    <Button
                      className={classes.addBtn}
                      id="add-subject-button"
                      variant="contained"
                      onClick={(e) => {handleAdd(e, 0)}}
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
                  <TableCell width="10%" align="center">Category</TableCell>
                  <TableCell width="15%" align="center">Subject Code</TableCell>
                  <TableCell width="40%" align="center">Subject Name</TableCell>
                  <TableCell width="10%" align="center">CH</TableCell>
                  <TableCell width="15%" align="center">Default Trimester</TableCell>
                  <TableCell width="10%" align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.tableBody}>
                {this.state.editingPS.map((item, index) => {
                  if(item.defaultYear === 1) {
                    return (
                      <TableRow key={item.key}>
                        <TableCell align="center" component="th" scope="row">
                          {item.type}
                        </TableCell>
                        <TableCell align="center">{item.code}</TableCell>
                        <TableCell>{item.subject}</TableCell>
                        <TableCell align="center">{item.ch}</TableCell>
                        <TableCell align="center">{item.defaultTri}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={(e) => handleOpenDialog(e, index)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  } else { return <></> }
                })}
              </TableBody>
            </Table>
            
            <h1 className={classes.typoh1}>Year 2</h1>
            <Table className={classes.table} size="small" stickyHeader aria-label="caption table">
            <caption>
                <Grid container spacing={3} className={classes.gridContainer}>
                <Grid item xs>
                  <TextField
                      required
                      margin="dense"
                      id="category"
                      placeholder="Category"
                      onChange={(e) => onChange(e, 1)}
                      value={this.state.inputs[1].type}
                      name="type"
                    />
                  </Grid>
                  <Grid item xs>
                  <TextField
                      className={classes.codeInput}
                      margin="dense"
                      id="code"
                      placeholder="Subject Code"
                      inputProps={{ maxLength: 7 }}
                      // error= {(e) => (e.target.value.match(/[A-Z]{3}[0-9]{4}/)) ? false : true}
                      onChange={(e) => onChange(e, 1)}
                      // helperText={(e) => (e.target.value.match(/[A-Z]{3}[0-9]{4}/)) ? "" : "Invalid format: ABC1234"}
                      value={this.state.inputs[1].code}
                      name="code"
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="name"
                      placeholder="Subject Name"
                      onChange={(e) => onChange(e, 1)}
                      value={this.state.inputs[1].subject}
                      name="subject"
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="ch"
                      placeholder="Credit Hour"
                      type="number"
                      onChange={(e) => onChange(e, 1)}
                      value={this.state.inputs[1].ch}
                      name="ch"
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="defaultTri"
                      placeholder="Default Trimester"
                      type="number"
                      onChange={(e) => onChange(e, 1)}
                      value={this.state.inputs[1].defaultTri}
                      name="defaultTri"
                    />
                  </Grid>
                  <Grid item xs>
                    <Button
                      className={classes.addBtn}
                      id="add-subject-button"
                      variant="contained"
                      onClick={(e) => {handleAdd(e, 1)}}
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
                  <TableCell width="10%" align="center">Category</TableCell>
                  <TableCell width="15%" align="center">Subject Code</TableCell>
                  <TableCell width="40%" align="center">Subject Name</TableCell>
                  <TableCell width="10%" align="center">CH</TableCell>
                  <TableCell width="15%" align="center">Default Trimester</TableCell>
                  <TableCell width="10%" align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.tableBody}>
                {this.state.editingPS.map((item, index) => {
                  if(item.defaultYear === 2) {
                    return (
                      <TableRow key={item.key}>
                        <TableCell align="center" component="th" scope="row">
                          {item.type}
                        </TableCell>
                        <TableCell align="center">{item.code}</TableCell>
                        <TableCell>{item.subject}</TableCell>
                        <TableCell align="center">{item.ch}</TableCell>
                        <TableCell align="center">{item.defaultTri}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={(e) => handleOpenDialog(e, index)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  } else { return <></> }
                })}
              </TableBody>
            </Table>

            <h1 className={classes.typoh1}>Year 3</h1>
            <Table className={classes.table} size="small" stickyHeader aria-label="caption table">
            <caption>
                <Grid container spacing={3} className={classes.gridContainer}>
                <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="category"
                      placeholder="Category"
                      onChange={(e) => onChange(e, 2)}
                      value={this.state.inputs[2].type}
                      name="type"
                    />
                  </Grid>
                  <Grid item xs>
                  <TextField
                      className={classes.codeInput}
                      margin="dense"
                      id="code"
                      placeholder="Subject Code"
                      inputProps={{ maxLength: 7 }}
                      // error= {(e) => (e.target.value.match(/[A-Z]{3}[0-9]{4}/)) ? false : true}
                      onChange={(e) => onChange(e, 2)}
                      // helperText={(e) => (e.target.value.match(/[A-Z]{3}[0-9]{4}/)) ? "" : "Invalid format: ABC1234"}
                      value={this.state.inputs[2].code}
                      name="code"
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="name"
                      placeholder="Subject Name"
                      onChange={(e) => onChange(e, 2)}
                      value={this.state.inputs[2].subject}
                      name="subject"
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="ch"
                      placeholder="Credit Hour"
                      type="number"
                      onChange={(e) => onChange(e, 2)}
                      value={this.state.inputs[2].ch}
                      name="ch"
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="defaultTri"
                      placeholder="Default Trimester"
                      type="number"
                      onChange={(e) => onChange(e, 2)}
                      value={this.state.inputs[2].defaultTri}
                      name="defaultTri"
                    />
                  </Grid>
                  <Grid item xs>
                    <Button
                      className={classes.addBtn}
                      id="add-subject-button"
                      variant="contained"
                      onClick={(e) => {handleAdd(e, 2)}}
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
                  <TableCell width="10%" align="center">Category</TableCell>
                  <TableCell width="15%" align="center">Subject Code</TableCell>
                  <TableCell width="40%" align="center">Subject Name</TableCell>
                  <TableCell width="10%" align="center">CH</TableCell>
                  <TableCell width="15%" align="center">Default Trimester</TableCell>
                  <TableCell width="10%" align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.tableBody}>
                {this.state.editingPS.map((item, index) => {
                  if(item.defaultYear === 3) {
                    return (
                      <TableRow key={item.key}>
                        <TableCell align="center" component="th" scope="row">
                          {item.type}
                        </TableCell>
                        <TableCell align="center">{item.code}</TableCell>
                        <TableCell>{item.subject}</TableCell>
                        <TableCell align="center">{item.ch}</TableCell>
                        <TableCell align="center">{item.defaultTri}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={(e) => handleOpenDialog(e, index)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  } else { return <></> }
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Tooltip title="Save Changes" aria-label="save">
            <Fab
              className={classes.saveBtn}
              color="primary"
              aria-label="save"
              disabled={
                ((this.state.selectedTri === 1 && JSON.stringify(this.state.editingPS) === JSON.stringify(this.state.tri1PS)) ||
                  (this.state.selectedTri === 2 && JSON.stringify(this.state.editingPS) === JSON.stringify(this.state.tri2PS)) ||
                  (this.state.selectedTri === 3 && JSON.stringify(this.state.editingPS) === JSON.stringify(this.state.tri3PS)))
                  ? true 
                  : false
              }
              onClick={handleSave}
            >
              <SaveIcon />
            </Fab>
          </Tooltip>
        </Paper>
        <Dialog
          open={this.state.openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Remove subject?"}</DialogTitle>
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
        <Snackbar open={this.state.openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={this.state.snackbarSev}>
            {this.state.snackbarMsg}
          </Alert>
        </Snackbar>
      </div>
    );
  }
});