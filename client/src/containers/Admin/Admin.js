import React from 'react';
import { withStyles } from '@material-ui/core/styles';
// import {writeJsonFile} from 'write-json-file';

// import TriJson from '../../constants/trimesters.json';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Login from '../../components/Admin/Login';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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

import axios from 'axios';
const API_PATH = process.env.REACT_APP_API_PATH;

const useStyles = withStyles((theme) => ({
  container: {
    alignItems: "center",
  },
  editTriCard: {
    marginLeft: "auto",
    marginRight: "auto",
    minWidth: 275,
    maxWidth: "55vw"
  },
  submitBtn: {
    float: "right",
  },
  pos: {
    marginBottom: 12,
  },
  floatRight: {
    float: "right"
  },
  select: {
    width: "100%"
  },
  editSubjectCard: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 20,
    minWidth: 275,
    maxWidth: "55vw",
  },
  marginlrAuto: {
    marginLeft: "auto",
    marginRight: "auto",
  }
}));

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.token
}

// async function editTrimester (newData) {
//   await writeJsonFile('../../constants/trimesters.json', {foo: true});
// }


export default useStyles(class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: getToken(),
      trimester1: '',
      trimester2: '',
      trimester3: '',
      subjects: [],
      open: false,
      errorCode: false
    }
    // this.setState({token: getToken()})
  }

  componentDidMount() {
    axios.get( API_PATH + "/trimesters.json")
      .then((response) => {
        this.setState({
          trimester1: response.data[0].toString(),
          trimester2: response.data[1].toString(),
          trimester3: response.data[2].toString(),
        });
      });
    axios.get( API_PATH + "/subjectLists.json")
      .then((response) => {
        this.setState({
          subjects: response.data
        })
      });
  }

  callbackFunction = (childData) => {
    this.setState({token: childData})
  }

  onChange(event) {
    if (event.target.value.match(/[A-Z]{3}[0-9]{4}/)) {
      this.setState({ errorCode: false });
    } else {
      this.setState({ errorCode: true });
      event.target.helperText = "Invalid format: ABC1234";
    }
  }
  
  render(){
    const { classes } = this.props;

    const handleChange = (event, tri) => {
      this.setState({[tri]: event.target.value});
    };

    const handleListOpen = () => {
      this.setState({open: true});
    };
  
    const handleClose = () => {
      this.setState({open: false});
    };

    const handleDelete = (e, key) => {
      e.preventDefault();
      var list = this.state.subjects;
      list.splice(key, 1);
      this.setState({
        subjects: list
      });
    };

    const onSubmitTriMonth = () => {
      var newData = [];
      console.log(this.state.trimester1);
      newData.push(this.state.trimester1);
      newData.push(this.state.trimester2);
      newData.push(this.state.trimester3);
      axios.post(API_PATH + '/trimesters',{
        newData: newData
      });
    }

    // DEBUG
    if(!this.state.token) {
      return <Login setToken={setToken} parentCallback={this.callbackFunction} />
    }

    return (
      <div className={classes.container}>
        {/* Edit Trimesters */}
        <Card className={classes.editTriCard}>
          <CardContent>
            <Typography gutterBottom variant="h6" component="h2">
              Trimester Months:
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs>
                <InputLabel id="trimester1-select-label">Trimester 1</InputLabel>
                <Select
                  className={classes.select}
                  labelId="trimester1-select-label"
                  id="trimester1-select"
                  value={this.state.trimester1}
                  onChange={(e) => {handleChange(e, "trimester1")}}
                >
                  <MenuItem value={"January"}>January</MenuItem>
                  <MenuItem value={"February"}>February</MenuItem>
                  <MenuItem value={"March"}>March</MenuItem>
                  <MenuItem value={"April"}>April</MenuItem>
                  <MenuItem value={"May"}>May</MenuItem>
                  <MenuItem value={"June"}>June</MenuItem>
                  <MenuItem value={"July"}>July</MenuItem>
                  <MenuItem value={"August"}>August</MenuItem>
                  <MenuItem value={"September"}>September</MenuItem>
                  <MenuItem value={"October"}>October</MenuItem>
                  <MenuItem value={"November"}>November</MenuItem>
                  <MenuItem value={"December"}>December</MenuItem>
                </Select>
              </Grid>
              <Grid item xs>
                <InputLabel id="trimester2-select-label">Trimester 2</InputLabel>
                <Select
                  className={classes.select}
                  labelId="trimester2-select-label"
                  id="trimester2-select"
                  value={this.state.trimester2}
                  onChange={(e) => {handleChange(e, "trimester2")}}
                >
                  <MenuItem value={"January"}>January</MenuItem>
                  <MenuItem value={"February"}>February</MenuItem>
                  <MenuItem value={"March"}>March</MenuItem>
                  <MenuItem value={"April"}>April</MenuItem>
                  <MenuItem value={"May"}>May</MenuItem>
                  <MenuItem value={"June"}>June</MenuItem>
                  <MenuItem value={"July"}>July</MenuItem>
                  <MenuItem value={"August"}>August</MenuItem>
                  <MenuItem value={"September"}>September</MenuItem>
                  <MenuItem value={"October"}>October</MenuItem>
                  <MenuItem value={"November"}>November</MenuItem>
                  <MenuItem value={"December"}>December</MenuItem>
                </Select>
              </Grid>
              <Grid item xs>
                <InputLabel id="trimester3-select-label">Trimester 3</InputLabel>
                <Select
                  className={classes.select}
                  labelId="trimester3-select-label"
                  id="trimester3-select"
                  value={this.state.trimester3}
                  onChange={(e) => {handleChange(e, "trimester3")}}
                >
                  <MenuItem value={"January"}>January</MenuItem>
                  <MenuItem value={"February"}>February</MenuItem>
                  <MenuItem value={"March"}>March</MenuItem>
                  <MenuItem value={"April"}>April</MenuItem>
                  <MenuItem value={"May"}>May</MenuItem>
                  <MenuItem value={"June"}>June</MenuItem>
                  <MenuItem value={"July"}>July</MenuItem>
                  <MenuItem value={"August"}>August</MenuItem>
                  <MenuItem value={"September"}>September</MenuItem>
                  <MenuItem value={"October"}>October</MenuItem>
                  <MenuItem value={"November"}>November</MenuItem>
                  <MenuItem value={"December"}>December</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions className={classes.submitBtn}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={onSubmitTriMonth}
            >
              Submit
            </Button>
          </CardActions>
        </Card>

        {/* Edit subject list */}
          <Button variant="outlined" color="primary" onClick={handleListOpen}>
            Edit Subject List
          </Button>
          <Dialog open={this.state.open} onClose={handleClose} aria-labelledby="form-dialog-title">
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
              />
              <TextField
                required
                margin="dense"
                id="name"
                placeholder="Subject Name"
                variant="outlined"
              />
              <Button onClick={handleClose} color="primary">
                Add
              </Button>
              <Button onClick={handleClose} color="primary">
                Done
              </Button>
            </DialogActions>
          </Dialog>
      </div>
    );
  }
});