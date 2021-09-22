import React from 'react';
import { withStyles } from '@material-ui/core/styles';
// import {writeJsonFile} from 'write-json-file';

// import TriJson from '../../constants/trimesters.json';
import TextField from '@material-ui/core/TextField';
import Login from '../../components/Admin/Login';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Button } from '@material-ui/core';

import axios from 'axios';

const fs = require('fs');
const path = require('path');

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
    axios.get(process.env.REACT_APP_API_PATH + "/trimesters.json")
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
    const fs = require('fs');
    const writeFile = (filePath, fileContent) => {
      return new Promise((resolve, reject) => {
       fs.writeFile(filePath, fileContent, writeFileError => {
        if (writeFileError) {
         reject(writeFileError);
         return;
        }
     
        resolve(filePath);
       });
      });
    };

    const handleChange = (event, tri) => {
      this.setState({[tri]: event.target.value});
    };

    function onSubmit() {
      // fs = require('fs');
      var name = '../../constants/trimesters.json';
      // var m = JSON.parse(fs.readFileSync(name).toString());
      var newData = ["January", "February", "March"];
      // newData.push(this.state.trimester1);
      // newData.push(this.state.trimester2);
      // newData.push(this.state.trimester3);
      // fs.writeFileSync(name, JSON.stringify(newData));
      // fs.writeFile('../../constants/trimesters.json', JSON.stringify(newData), (err) => {
      //   if (err) console.log('Error writing file:', err);
      // })
      // writeFile(name, JSON.stringify(newData));
      fs.writeFileSync(path.resolve(__dirname, 'trimesters.json'), JSON.stringify(newData));
    }

    // DEBUG
    if(!this.state.token) {
      return <Login setToken={setToken} parentCallback={this.callbackFunction} />
    }

    return (
      <div className={classes.container}>
        <form className={classes.root} noValidate autoComplete="off">
          Trimester Months: 
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
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
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
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
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
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
        </form>
        <Button 
          className={classes.submitBtn} 
          variant="contained" 
          color="primary"
          // onClick={onSubmit}
        >
          Submit
        </Button>
      </div>
    );
  }
});