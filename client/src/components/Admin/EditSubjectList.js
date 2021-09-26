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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import axios from 'axios';
const API_PATH = process.env.REACT_APP_API_PATH;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = withStyles((theme) => ({
  btnSL: {
    width: "100%",
    marginTop: 30
  }
}));

export default useStyles(class EditSubjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: [],
      openList: false,
      openAddPop: false,
      addPopMsg: '',
      newCode: '',
      newSubject: '',
      errorCode: false,
      alertSev: 'error'
    }
  }

  componentDidMount() {
    axios.get( API_PATH + "/subjectLists.json")
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
      if (event.target.value.match(/[A-Z]{3}[0-9]{4}/)) {
        this.setState({ errorCode: false });
      } else {
        this.setState({ errorCode: true });
        event.target.helperText = "Invalid format: ABC1234";
      }
    } else {
      this.setState({
        newSubject: event.target.value
      });
    }
  }

  render(){
    const { classes } = this.props;
    const handleListOpen = () => {
      this.setState({openList: true});
    };
  
    const handleCloseList = () => {
      this.setState({openList: false});
    };

    const handleCloseSnackbar = () => {
      this.setState({openAddPop: false});
    };

    const handleDelete = (e, key) => {
      e.preventDefault();
      var list = this.state.subjects;
      list.splice(key, 1);
      this.setState({
        subjects: list
      });
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
      }
    };

    const handleDoneList = (event) => {
      event.preventDefault();
      axios.post(API_PATH + '/subjectLists', {
        subjects: this.state.subjects
      }).then((res) => {
        this.setState({
          addPopMsg: 'Subject list updated successfully.',
          alertSev: 'success',
          openAddPop: true,
          openList: false
        });
      }).catch((err) => {
        console.log(err);
      })
    }

    return (
      <div>
        <Grid container spacing={3}>
          <Grid item xs>
          </Grid>
          <Grid item xs={1.5}>
            <Button className={classes.btnSL} variant="contained" color="primary" onClick={handleListOpen}>
              Edit Subject List
            </Button>
          </Grid>
          <Grid item xs>
          </Grid>
        </Grid>          
        <Dialog open={this.state.openList} onClose={handleCloseList} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Edit Subject List</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <List dense={true}>
                {this.state.subjects.map((value, index) => {
                  const labelId = `checkbox-list-label-${value.code}`;

                  return (
                    <ListItem onClick={(e) => {handleDelete(e, index)}} >
                      <ListItemText id={labelId} primary={`${value.code + " - " + value.name}`} />
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  );
                })}
              </List>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <TextField
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
            <TextField
              required
              margin="dense"
              id="name"
              placeholder="Subject Name"
              variant="outlined"
              onChange={this.onChange.bind(this)}
              value={this.state.newSubject}
            />
            <Button 
              id="add-subject-button"
              onClick={handleAdd} 
              color="primary"
              disabled={
                (this.state.newCode && this.state.newSubject && 
                  this.state.newCode.match(/[A-Z]{3}[0-9]{4}/)) 
                  ? false : true
              }
            >
              Add
            </Button>
            <Button onClick={handleCloseList} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDoneList} color="primary">
              Done
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar open={this.state.openAddPop} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={this.state.alertSev}>
            {this.state.addPopMsg}
          </Alert>
        </Snackbar>
      </div>
    );
  }
});