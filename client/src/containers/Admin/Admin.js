import React from 'react';
import { withStyles } from '@material-ui/core/styles';
// import {writeJsonFile} from 'write-json-file';

import yourJson from '../../constants/trimesters.json';
import TextField from '@material-ui/core/TextField';
import Login from '../../components/Admin/Login';

const useStyles = withStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const fs = require('fs')

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
    }
    // this.setState({token: getToken()})
  }

  callbackFunction = (childData) => {
    this.setState({token: childData})
  }
  
  render(){
    const { classes } = this.props;

    if(!this.state.token) {
      return <Login setToken={setToken} parentCallback={this.callbackFunction} />
    }

    return (
      <div className={classes.container}>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField id="standard-basic" label="Standard" />
          <TextField id="standard-basic" label="Standard" />
          <TextField id="standard-basic" label="Standard" />
        </form>
      </div>
    );
  }
});