import React from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import axios from 'axios';
const API_PATH = process.env.REACT_APP_API_PATH;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = withStyles((theme) => ({
  btnSL: {
    width: "100%",
    marginTop: 30
  },
  listPaper:  {
    width: "50vw",
    marginLeft: "auto",
    marginRight: "auto",
    ['@media (max-width:1023px)']: {
      width: "70vw",
      marginLeft: "auto",
      marginRight: "auto",
    },
    ['@media (max-width:733px)']: {
      width: "90vw",
    },
    marginBottom: "15px",
    height: "70vh",
    overflowY: "scroll",
  },
  gridContainer: {
    width: "50vw",
    marginLeft: "auto",
    marginRight: "auto",
    ['@media (max-width:1023px)']: {
      width: "70vw",
      marginLeft: "auto",
      marginRight: "auto",
    },
    ['@media (max-width:733px)']: {
      width: "90vw",
    },
  },
  codeInput: {
    // marginRight: "20px",
  },
  addBtnGrid: {
    display: "flex",
    justifyContent: "right",
    alignItems: "center",
  },
  addBtn: {
    float: "right"
  },
  multiSelect: {
    margin: theme.spacing(1),
    minWidth: 125,
    maxWidth: 125,
  }
}));

export default useStyles(class EditSubjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: [],
      openAddPop: false,
      addPopMsg: '',
      alertSev: 'error',
      newCode: '',
      newSubject: '',
      newCH: '',
      newPreReq: [],
      errorCode: false,
      openDialog: false,
      deletingItem: null,
    }
  }

  componentDidMount() {
    axios.get( API_PATH + "/subjectList.json")
      .then((response) => {
        this.setState({
          subjects: response.data
        })
      });
  }

  onChange(event) {
    const { name } = event.target;
    this.setState({
      [name]: (name === "newCH") ? Number(event.target.value) : event.target.value
    });
  }

  render(){
    const { classes } = this.props;
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 200;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4 + ITEM_PADDING_TOP,
          // width: 400,
        },
      },
    };

    const handleCloseSnackbar = () => {
      this.setState({openAddPop: false});
    };

    const handleDelete = (e) => {
      e.preventDefault();
      var list = this.state.subjects;
      list.splice(this.state.deletingItem, 1);
      this.setState({
        subjects: list
      });
      axios.post(API_PATH + '/subjectList', {
        subjects: list
      }).then((res) => {
        this.setState({
          addPopMsg: 'Subject list updated successfully.',
          alertSev: 'success',
          openAddPop: true,
          openList: false
        });
      }).catch((err) => {
        console.log(err);
      });

      handleCloseDialog(e);
    };

    const handleAdd = (event) => {
      event.preventDefault();
      
      var list = this.state.subjects;
      if(list.filter(e => e.code === this.state.newCode || e.name === this.state.newSubject).length > 0) {
        this.setState({
          addPopMsg: 'Subject name or code has already existed.', 
          alertSev: 'error',
          openAddPop: true
        });
      } else {
        list.push({
          code: this.state.newCode,
          name: this.state.newSubject,
          ch: this.state.newCH
        });
        this.setState({
          subjects: list,
          newCode: '',
          newSubject: '',
          newCH: '',
          prereq: ''
        });
        axios.post(API_PATH + '/subjectList', {
          subjects: list
        }).then((res) => {
          this.setState({
            addPopMsg: 'Subject list updated successfully.',
            alertSev: 'success',
            openAddPop: true,
            openList: false
          });
        }).catch((err) => {
          console.log(err);
        });
      }
    };

    const handleOpenDialog = (event, index) => {
      event.preventDefault();
      this.setState({
        deletingItem: index,
        openDialog: true
      });
    }

    const handleCloseDialog = (event) => {
      event.preventDefault();
      this.setState({
        deletingItem: null,
        openDialog: false
      });
    }

    const handleChangePreReq = (event) => {
      this.setState({newPreReq: event.target.value});
    };

    return (
      <div>
        <Paper className={classes.listPaper} elevation={2}>
          <List dense={true}>
            {this.state.subjects.map((value, index) => {
              const labelId = `checkbox-list-label-${value.code}`;

              return (
                <ListItem onClick={(e) => {handleOpenDialog(e, index)}} >
                  <ListItemText id={labelId} style={{textAlign: "left", width: "15%"}} primary={`${value.code} - `} />
                  <ListItemText id={labelId} style={{textAlign: "left", width: "75%"}} primary={`${value.name}`} />
                  <ListItemText style={{textAlign: "center", width: "10%"}} primary={`${value.ch} CH`} />
                  <IconButton style={{width: "5%"}} edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              );
            })}
          </List>
        </Paper>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item xs={2}>
            <TextField
              className={classes.codeInput}
              margin="dense"
              id="code"
              name="newCode"
              placeholder="Code"
              inputProps={{ maxLength: 7 }}
              error= {this.state.errorCode}
              onChange={this.onChange.bind(this)}
              variant="outlined"
              helperText={ this.state.errorCode ? "Invalid format: ABC1234" : ""}
              value={this.state.newCode}
            />            
          </Grid>
          <Grid item xs={3}>
            <TextField
              required
              margin="dense"
              id="name"
              name="newSubject"
              placeholder="Subject Name"
              variant="outlined"
              onChange={this.onChange.bind(this)}
              value={this.state.newSubject}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              required
              margin="dense"
              id="ch"
              name="newCH"
              type="number"
              placeholder="Credit Hour"
              variant="outlined"
              onChange={this.onChange.bind(this)}
              value={this.state.newCH}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl className={classes.multiSelect}>
              <Select
                multiple
                displayEmpty
                value={this.state.newPreReq}
                onChange={handleChangePreReq}
                input={<OutlinedInput margin="dense"/>}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <div style={{font: "inherit", color: "#aaa"}}>Placeholder</div>;
                  }

                  return selected.join(', ');
                }}
                MenuProps={MenuProps}
                inputProps={{ 'aria-label': 'Without label'}}
                // style={{padding: "10.5px 14px"}}
              >
                <MenuItem disabled value="">
                  <div style={{font: "inherit", color: "#aaa"}}>Placeholder</div>
                </MenuItem>
                {this.state.subjects.map((subject) => (
                  <MenuItem key={subject.code} value={subject.code}>
                    {subject.code + ' - ' + subject.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid className={classes.addBtnGrid} item xs={1}>
            <Button
              className={classes.addBtn}
              id="add-subject-button"
              variant="contained"
              onClick={handleAdd} 
              color="primary"
              disabled={
                (this.state.newCode && this.state.newSubject && this.state.newCH
                  // && this.state.newCode.match(/[A-Z]{3}[0-9]{4}/)
                  ) 
                  ? false : true
              }
            >
              Add
            </Button>
          </Grid>
        </Grid>
        <Snackbar open={this.state.openAddPop} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={this.state.alertSev}>
            {this.state.addPopMsg}
          </Alert>
        </Snackbar>
        <Dialog
          open={this.state.openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Remove subject from list?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure to remove the subject permanently?
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
      </div>
    );
  }
});