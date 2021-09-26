import React from 'react';
import { withStyles } from '@material-ui/core/styles';
// import {writeJsonFile} from 'write-json-file';

// import TriJson from '../../constants/trimesters.json';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import axios from 'axios';
const API_PATH = process.env.REACT_APP_API_PATH;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = withStyles((theme) => ({
}));

export default useStyles(class EditSPS extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    // axios.get( API_PATH + "/trimesters.json")
    //   .then((response) => {
    //     this.setState({
    //       trimester1: response.data[0].toString(),
    //       trimester2: response.data[1].toString(),
    //       trimester3: response.data[2].toString(),
    //     });
    //   });
  }
  
  render(){
    const { classes } = this.props;

    return (
      <div>
        
      </div>
    );
  }
});