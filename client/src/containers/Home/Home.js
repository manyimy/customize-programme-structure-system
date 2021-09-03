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
import Alert from '@material-ui/lab/Alert';
import Trimesters from '../../constants/trimesters.json';
import Specs from '../../constants/specs.json';

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
  },
  inputAlert: {
    boxShadow: "4px 5px #e4e4e4",
    position: "absolute",
    zIndex: 100,
    inlineSize: "fit-content",
    marginLeft: "auto",
    marginRight: "auto",
    left: 0,
    right: 0,
    display: "none"
  }
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
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      data: {
        intake: '',
        year: 0,
        spec: ''
      },
      intakeInputSize: 2,
      yearInputSize: 1,
      specInputSize: 2,
      yearOptions: []
    }
    this.timerId = null;
  }
  
  componentDidMount() {
    if(window.innerWidth <= 480) {
      this.setState({intakeInputSize: 5, specInputSize: 6});
    }
    this.getYear();
  }

  handleNext = () => {
    if(this.state.data.intake && this.state.data.spec) {
      let prevActiveStep = this.state.activeStep;
      this.setState({ activeStep: prevActiveStep + 1 });
    } else {
      this.showError();
    }
    
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
  };

  showError = () => {
    // document.getElementById("error-alert").innerText = message;
    document.getElementById("error-alert").style.display = "flex";
    this.timerId = setTimeout(() => {
      document.getElementById("error-alert").style.display = "none";
      this.timerId = null;
    }, 5000);
  }
  
  getYear = () => {
    let thisYear = (new Date()).getFullYear();
    let years = [];
    for(let i = thisYear-4; years.length <= 6; i++) {
      years.push(i);
    }
    this.setState({yearOptions: years});
  }

  render(){
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <Alert id="error-alert" severity="error" className={classes.inputAlert}>Input field(s) cannot be empty!</Alert>
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
               {(window.innerWidth > 480 ? 
                  <Grid  item xs>
                    <Paper className={classes.paper}></Paper>
                  </Grid>
                  :<div></div>
               )}
                <Grid item xs={this.state.intakeInputSize}>
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
                      required
                    >
                      <option aria-label="None" value="" />
                      {Trimesters.map((item, index) => {
                        return <option key={item}>{item}</option>
                      })}
                    </Select>
                    <FormHelperText>Required</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={this.state.intakeInputSize}>
                  <FormControl required className={classes.formControl}>
                    <InputLabel htmlFor="intake-native-simple">Year</InputLabel>
                    <Select
                      native
                      value={this.state.data.year}
                      onChange={this.handleChange}
                      inputProps={{
                        name: 'year',
                        id: 'year-native-simple',
                      }}
                      required
                    >
                      <option aria-label="None" value="" />
                      {this.state.yearOptions.map((item, index) => {
                        return <option key={item}>{item}</option>
                      })}
                    </Select>
                    <FormHelperText>Required</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={this.state.specInputSize}>
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
                      {Specs.map((item, index) => {
                        return <option key={item}>{item}</option>
                      })}
                    </Select>
                    <FormHelperText>Required</FormHelperText>
                  </FormControl>
                </Grid>
                {(window.innerWidth > 480 ? 
                  <Grid item xs>
                    <Paper className={classes.paper}></Paper>
                  </Grid>
                  : <div></div>
                )}
              </Grid>
              <Grid container spacing={3} >
              {(window.innerWidth > 480 ? 
                <Grid item xs>
                  <Paper className={classes.paper}></Paper>
                </Grid>
                : <div></div>
              )}
                <Grid item xs={12}>
                  <TransferList />
                </Grid>
              {(window.innerWidth > 480 ? 
                <Grid item xs>
                  <Paper className={classes.paper}></Paper>
                </Grid>
                : <div></div>
              )}
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
                  <PSTable
                    intake={this.state.data.intake}
                    year={this.state.data.year}
                  />
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
                    table="ps-table"
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