import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Login from '../../components/Admin/Login';
import EditSubjectList from '../../components/Admin/EditSubjectList';
import EditTriMonths from '../../components/Admin/EditTriMonths';

const useStyles = withStyles((theme) => ({
  container: {
    alignItems: "center",
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

export default useStyles(class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: getToken()
    }
  }

  callbackFunction = (childData) => {
    this.setState({token: childData})
  }
  
  render(){
    const { classes } = this.props;

    // DEBUG
    if(!this.state.token) {
      return <Login setToken={setToken} parentCallback={this.callbackFunction} />
    }

    return (
      <div className={classes.container}>
        <EditTriMonths />
        <EditSubjectList />
      </div>
    );
  }
});