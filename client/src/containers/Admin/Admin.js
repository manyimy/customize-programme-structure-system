import React from 'react';
import { withStyles } from '@material-ui/core/styles';
// import {writeJsonFile} from 'write-json-file';

// import TriJson from '../../constants/trimesters.json';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Login from '../../components/Admin/Login';
import { Button } from '@material-ui/core';

import axios from 'axios';
const API_PATH = process.env.REACT_APP_API_PATH;

const useStyles = withStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  submitBtn: {
    float: "right",
    marginRight: 200,
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
  }

  callbackFunction = (childData) => {
    this.setState({token: childData})
  }
  
  render(){
    const { classes } = this.props;

    const handleChange = (event, tri) => {
      this.setState({[tri]: event.target.value});
    };

    const onSubmit = () => {
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
        <h3>Trimester Months:</h3>
        <form className={classes.root} noValidate autoComplete="off">
          <FormControl className={classes.formControl}>
            <InputLabel id="trimester1-select-label">Trimester 1</InputLabel>
            <Select
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
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="trimester2-select-label">Trimester 2</InputLabel>
            <Select
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
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="trimester3-select-label">Trimester 3</InputLabel>
            <Select
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
          </FormControl>
        </form>
        <Button 
          className={classes.submitBtn} 
          variant="contained" 
          color="primary"
          onClick={onSubmit}
        >
          Submit
        </Button>
      </div>
    );
  }
});