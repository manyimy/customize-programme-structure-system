import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { getSteps, ColorlibConnector, ColorlibStepIcon } from '../Home/quontoComponent';
import TransferList from '../../components/Home/transferList';
import PSTable from '../../components/Home/psTable';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
// import { getTheme } from '../Setting/settingsReducer';
// import Alert from '@material-ui/lab/Alert';

import Login from '../../components/Admin/Login';

const useStyles = withStyles((theme) => ({

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
      </div>
    );
  }
});