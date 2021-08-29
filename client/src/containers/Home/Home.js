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
import { getSteps, ColorlibConnector, ColorlibStepIcon } from './quontoComponent';
import TransferList from '../../components/Home/transferList';
import PSTable from '../../components/Home/psTable';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { getTheme } from '../Setting/settingsReducer';

const useStyles = withStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: "100%",
  },
  container: {
    backgroundColor: theme.palette.background.paper,
  },
  btnContainer: {
    float: "right",
  },
  downloadBtn: {
    margin: theme.spacing(0.5, 0),
    padding:  theme.spacing(1, 1.5),
  }
  // root: {
  //   margin: 'auto',
  // },
  // cardHeader: {
  //   padding: theme.spacing(1, 2),
  // },
  // list: {
  //   width: 200,
  //   height: 230,
  //   backgroundColor: theme.palette.background.paper,
  //   overflow: 'auto',
  // },
  // button: {
  //   margin: theme.spacing(0.5, 0),
  // },
}));


const steps = getSteps();
// const [checked, setChecked] = React.useState([]);
// const [activeStep, setActiveStep] = React.useState(0);
// const [state, setState] = React.useState({
//   intake: '',
//   spec: '',
// });

// step navigation


export default useStyles(class Home extends React.Component {
  state = {
    activeStep: 0,
    data: {
      intake: '',
      spec: ''
    }
  }

  handleNext = () => {
    let prevActiveStep = this.state.activeStep;
    this.setState({ activeStep: prevActiveStep + 1 })
    // setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  handleBack = () => {
    let prevActiveStep = this.state.activeStep;
    this.setState({ activeStep: prevActiveStep - 1 })
    // setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  handleReset = () => {
    this.setState({ activeStep: 0 })
    // setActiveStep(0);
  };
  
  handleChange = (event) => {
    const name = event.target.name;
    this.setState({
      data: {
        ...this.state.data,
        [name]: event.target.value
      }
    });
    console.log(event.target.value)
    console.log(this.state.data)
  };
  
  render(){
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Stepper alternativeLabel activeStep={this.state.activeStep} connector={<ColorlibConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          {this.state.activeStep === steps.length ? (
            <div>
              <Button onClick={this.handleReset} className={classes.button}>
                Reset
              </Button>
            </div>
          ) :
          this.state.activeStep === 0 ? (
            <div>
              <Grid container spacing={3}>
                <Grid item xs>
                  <Paper className={classes.paper}></Paper>
                </Grid>
                <Grid item xs={2}>
                  <FormControl required className={classes.formControl}>
                    <InputLabel htmlFor="intake-native-simple">Intake</InputLabel>
                    <Select
                      native
                      value={this.state.data.intake}
                      onChange={this.handleChange}
                      inputProps={{
                        name: 'intake',
                        id: 'intake-native-simple',
                      }}
                    >
                      <option aria-label="None" value="" />
                      <option value={"April 2021"}>April 2021</option>
                      <option value={"July 2021"}>July 2021</option>
                      <option value={"September 2021"}>September 2021</option>
                    </Select>
                    <FormHelperText>Required</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl required className={classes.formControl}>
                    <InputLabel htmlFor="spec-native-simple">Specialization</InputLabel>
                    <Select
                      native
                      value={this.state.data.spec}
                      onChange={this.handleChange}
                      inputProps={{
                        name: 'spec',
                        id: 'spec-native-simple',
                      }}
                    >
                      <option aria-label="None" value="" />
                      <option value={"Software Engineering"}>Software Engineering</option>
                      <option value={"Game Development"}>Game Development</option>
                      <option value={"Data Science"}>Data Science</option>
                      <option value={"Cybersecurity"}>Cybersecurity</option>
                    </Select>
                    <FormHelperText>Required</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs>
                  <Paper className={classes.paper}></Paper>
                </Grid>
              </Grid>
              <Grid container spacing={3} >
                <Grid item xs>
                  <Paper className={classes.paper}></Paper>
                </Grid>
                <Grid item xs={5}>
                  <TransferList />
                </Grid>
                <Grid item xs>
                  <Paper className={classes.paper}></Paper>
                </Grid>
              </Grid>
              <div className={classes.btnContainer}>
                <Button disabled={this.state.activeStep === 0} onClick={this.handleBack} className={classes.button}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleNext}
                  className={classes.button}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <div className={classes.container}>
              <Grid container spacing={3} >
                <Grid item xs>
                  <Paper className={classes.paper}></Paper>
                </Grid>
                <Grid item xs={12}>
                  <PSTable greeting="Welcome to Rex"/>
                </Grid>
                <Grid item xs>
                  <Paper className={classes.paper}></Paper>
                </Grid>
              </Grid>
              <div className={classes.btnContainer}>
                <Button disabled={this.state.activeStep === 0} onClick={this.handleBack} className={classes.button}>
                  Back
                </Button>
                {/* <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                > */}
                  <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className={classes.downloadBtn + " download-table-xls-button" }
                    table="table-to-xls"
                    filename="tablexls"
                    sheet="tablexls"
                    buttonText="Download"/>
                  {/* Download */}
                {/* </Button> */}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
});