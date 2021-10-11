import React from 'react';
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
  listPaper: {
    width: "45vw",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "15px",
    height: "70vh",
    overflowY: "scroll",
  },
  gridContainer: {
    width: "45vw",
    marginLeft: "auto",
    marginRight: "auto",
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
    if (event.target.id === "code") {
      this.setState({
        newCode: event.target.value
      });
      // if (event.target.value.match(/[A-Z]{3}[0-9]{4}/)) {
      //   this.setState({ errorCode: false });
      // } else {
      //   this.setState({ errorCode: true });
      //   event.target.helperText = "Invalid format: ABC1234";
      // }
    } else {
      this.setState({
        newSubject: event.target.value
      });
    }
  }

  render(){
    const { classes } = this.props;
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
          name: this.state.newSubject
        });
        this.setState({
          subjects: list,
          newCode: '',
          newSubject: ''
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

    return (
      <div>
        <Paper className={classes.listPaper} elevation={2}>
          <List dense={true}>
            {this.state.subjects.map((value, index) => {
              const labelId = `checkbox-list-label-${value.code}`;

              return (
                <ListItem onClick={(e) => {handleOpenDialog(e, index)}} >
                  <ListItemText id={labelId} primary={`${value.code + " - " + value.name}`} />
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              );
            })}
          </List>
        </Paper>
        <Grid container spacing={3} className={classes.gridContainer}>
          <Grid item xs={4}>
            <TextField
              className={classes.codeInput}
              margin="dense"
              id="code"
              placeholder="Code"
              inputProps={{ maxLength: 7 }}
              error= {this.state.errorCode}
              onChange={this.onChange.bind(this)}
              variant="outlined"
              helperText={ this.state.errorCode ? "Invalid format: ABC1234" : ""}
              value={this.state.newCode}
            />            
          </Grid>
          <Grid item xs={4}>
            <TextField
              required
              margin="dense"
              id="name"
              placeholder="Subject Name"
              variant="outlined"
              onChange={this.onChange.bind(this)}
              value={this.state.newSubject}
            />
          </Grid>
          <Grid className={classes.addBtnGrid} item xs={4}>
            <Button
              className={classes.addBtn}
              id="add-subject-button"
              variant="contained"
              onClick={handleAdd} 
              color="primary"
              disabled={
                (this.state.newCode && this.state.newSubject 
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