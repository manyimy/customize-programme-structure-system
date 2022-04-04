import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Tooltip from '@material-ui/core/Tooltip';

import axios from 'axios';

// import Trimesters from '../../constants/trimesters.json';
// import Specs from '../../constants/specs.json';

const ALL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const useStyles = makeStyles((theme) => ({
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
  },
  pstable: {
    textAlign: "-webkit-center"
  },
  helpIcon: {
    margin: "5px 10px",
    color: "darkgrey",
  }
}));

const steps = getSteps();

export default function Home(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [intakeInputSize, setIntakeInputSize] = useState(2);
  const [specInputSize, setSpecInputSize] = useState(2);
  const [Specs, setSpecs] = useState([]);
  const [standardPS, setStandardPS] = useState([]);
  const [data, setData] = useState(
    {
      intake: '',
      year: (new Date()).getFullYear(),
      spec: ''
    }
  );
  const [timerId, setTimerId] = useState(null);
  const [right, setRight] = useState([]);
  const [longTriCHLimit, setLongTriCHLimit] = useState(20);
  const [shortTriCHLimit, setShortTriCHLimit] = useState(10);
  const marksLong = [
    {
      value: 16,
      label: '16 CH',
    },
    {
      value: 20,
      label: '20 CH',
    },
  ];
  const marksShort = [
    // {
    //   value: 6,
    //   label: '6 CH',
    // },
    {
      value: 10,
      label: '10 CH',
    },
  ];

  useEffect(() => {
    if(window.innerWidth <= 480) {
      setIntakeInputSize(5);
      setSpecInputSize(6);
    }
    axios.get(process.env.REACT_APP_API_PATH + "/standardPS.json")
      .then((response) => {
        setStandardPS(response.data);
      });
    
    axios.get(process.env.REACT_APP_API_PATH + "/specs.json")
      .then((response) => {
        setSpecs(response.data);
      });
  }, []);

  const setRightCallback = useCallback((right) => {
    setRight(right);
  }, []);

  const handleNext = () => {
    if(data.intake && data.year && data.spec) {
      let prevActiveStep = activeStep;
      setActiveStep(prevActiveStep + 1);
    } else {
      showError();
    }
  };
  
  const handleBack = () => {
    let prevActiveStep = activeStep;
    setRight([]);
    setActiveStep(prevActiveStep - 1);
  };
  
  // reset step back to 0
  const handleReset = () => {
    setActiveStep(0);
  };
  
  // handle intake and specialization input selection changes
  const handleChange = (event) => {
    const name = event.target.name;
    const updateData = {
      ...data,
      [name]: event.target.value
    };
    setData(updateData);
  };

  // pop up error message and close after 5 seconds
  const showError = () => {
    // document.getElementById("error-alert").innerText = message;
    document.getElementById("error-alert").style.display = "flex";
    const timerId = setTimeout(() => {
      document.getElementById("error-alert").style.display = "none";
      setTimerId(null);
    }, 5000);
  }

  // export to csv
  var tablesToExcel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,'
    , tmplWorkbookXML = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'
    + '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Axel Richter</Author><Created>{created}</Created></DocumentProperties>'
    + '<Styles>'
    + '<Style ss:ID="Content"><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>'
    + '<Style ss:ID="Title"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Font ss:Bold="1"/><Interior ss:Color="#d1d0c5" ss:Pattern="Solid"/></Style>'
    // + '<Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>'
    + '</Styles>' 
      + '{worksheets}</Workbook>'
    , tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{columns}{rows}</Table></Worksheet>'
    , tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>'
    , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
    return function(e, tables, wsnames, wbname, appname) {
      e.preventDefault();
      var ctx = "";
      var workbookXML = "";
      var worksheetsXML = "";
      var colsXML = "";
      var rowsXML = "";
      
      
      for (var i = 0; i < tables.length; i++) {
        let maxWidth = [0,0,0,0,0];
        console.log(tables[i].nodeType);
        console.log(document.getElementById(tables[i]));
        if (!tables[i].nodeType) tables[i] = document.getElementById(tables[i]);
        for (var j = 0; j < tables[i].rows.length; j++) {
          rowsXML += '<Row>'
          for (var k = 0; k < tables[i].rows[j].cells.length; k++) {
            var dataType = tables[i].rows[j].cells[k].getAttribute("dataType");
            var dataStyle = tables[i].rows[j].cells[k].getAttribute("dataStyle");
            var dataValue = tables[i].rows[j].cells[k].getAttribute("dataValue");
            dataValue = (dataValue)?dataValue:tables[i].rows[j].cells[k].innerHTML;
            maxWidth[k] = (dataValue.length > maxWidth[k]) ? dataValue.length : maxWidth[k];
            var dataFormula = tables[i].rows[j].cells[k].getAttribute("dataFormula");
            dataFormula = (dataFormula)?dataFormula:(appname==='Calc' && dataType==='DateTime')?dataValue:null;
            ctx = {  attributeStyleID: (dataStyle==='Title' || dataStyle==='Content')?' ss:StyleID="'+dataStyle+'"':''
                    , nameType: (dataType==='Number' || dataType==='DateTime' || dataType==='Boolean' || dataType==='Error')?dataType:'String'
                    , data: (dataFormula)?'':dataValue
                    , attributeFormula: (dataFormula)?' ss:Formula="'+dataFormula+'"':''
                  };
            rowsXML += format(tmplCellXML, ctx);
          }
          rowsXML += '</Row>'
        }
        for (var p = 0; p < maxWidth.length; p++) {
          colsXML += '<Column ss:Index="'+(p+1)+'" ss:AutoFitWidth="1" ss:Width="'+(maxWidth[p]*5+10)+'"/>'
        }
        console.log(colsXML);
        ctx = {columns: colsXML, rows: rowsXML, nameWS: wsnames[i] || 'Sheet' + i};
        worksheetsXML += format(tmplWorksheetXML, ctx);
        rowsXML = "";
        colsXML = "";
      }

      ctx = {created: (new Date()).getTime(), worksheets: worksheetsXML};
      workbookXML = format(tmplWorkbookXML, ctx);



      var link = document.createElement("A");
      link.href = uri + base64(workbookXML);
      link.download = wbname || 'Workbook.xls';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  })();

  return (
    <div className={classes.container}>
      <Alert id="error-alert" severity="error" className={classes.inputAlert}>Input field(s) cannot be empty!</Alert>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === 0 ? (
          <div>
            <Grid container spacing={3}>
            {(window.innerWidth > 480 ? 
                <Grid item xs>
                  <Paper className={classes.paper}></Paper>
                </Grid>
                :<div></div>
            )}
              <Grid item xs={intakeInputSize}>
                <FormControl required className={classes.formControl}>
                  <InputLabel htmlFor="intake-native-simple">Intake</InputLabel>
                  <Select
                    native
                    value={data.intake}
                    onChange={handleChange}
                    inputProps={{
                      name: 'intake',
                      id: 'intake-native-simple',
                    }}
                    required
                  >
                    <option aria-label="None" value="" />
                    {standardPS.sort(function(a, b) {
                      if(Number(a.intake.substring(a.intake.indexOf(' '))) !== Number(b.intake.substring(b.intake.indexOf(' ')))){
                        return Number(a.intake.substring(a.intake.indexOf(' '))) - Number(b.intake.substring(b.intake.indexOf(' ')));
                      }else{
                        return ALL_MONTHS.indexOf(a.intake.substring(0, a.intake.indexOf(' '))) - ALL_MONTHS.indexOf(b.intake.substring(0, b.intake.indexOf(' ')));
                      };
                    }).map((item, index) => {
                      return <option key={item.intake}>{item.intake}</option>
                    })}
                  </Select>
                  <FormHelperText>Required</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={specInputSize}>
                <FormControl required className={classes.formControl}>
                  <InputLabel htmlFor="spec-native-simple">Specialization</InputLabel>
                  <Select
                    native
                    value={data.spec}
                    onChange={handleChange}
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
            <Grid container spacing={8}>
              <Grid item xs></Grid>
              <Grid item xs={3}>
                <Typography id="discrete-slider-long" gutterBottom>
                  Long Trimester
                  <Tooltip title="Preferred maximum credit hour for long trimester." placement="right-start" arrow>
                    <HelpOutlineIcon fontSize='small' className={classes.helpIcon} />
                  </Tooltip>
                </Typography>
                <Slider
                  value={longTriCHLimit}
                  id="long-slider"
                  // getAriaValueText={valuetext}
                  aria-labelledby="discrete-slider-custom"
                  step={1}
                  min={16}
                  max={20}
                  valueLabelDisplay="auto"
                  marks={marksLong}
                  onChange={(e, newValue) => {setLongTriCHLimit(newValue);}}
                />
              </Grid>
              <Grid item xs={3}>
                <Typography id="discrete-slider-short" gutterBottom>
                  Short Trimester
                  <Tooltip title="Preferred maximum credit hour for short trimester." placement="right-start" arrow>
                    <HelpOutlineIcon fontSize='small' className={classes.helpIcon} />
                  </Tooltip>
                </Typography>
                <Slider
                  value={shortTriCHLimit}
                  id="short-slider"
                  // getAriaValueText={valuetext}
                  aria-labelledby="discrete-slider-custom"
                  step={1}
                  // min={6}
                  max={10}
                  valueLabelDisplay="auto"
                  marks={marksShort}
                  onChange={(e, newValue) => {setShortTriCHLimit(newValue);}}
                  disabled
                />
              </Grid>
              <Grid item xs></Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs></Grid>
              <Grid item xs={6}>
                <Typography variant="caption" display="block" align="right" style={{color: "grey"}} gutterBottom>
                  Preferred maximum credit hour per trimester may not be accurate. It may vary according to standard programme structure. 
                </Typography>
              </Grid>
              <Grid item xs></Grid>
            </Grid>
            <Grid container spacing={1} >
            {(window.innerWidth > 480 ? 
              <Grid item xs>
                <Paper className={classes.paper}></Paper>
              </Grid>
              : <div></div>
            )}
              <Grid item xs={12}>
                <TransferList
                  rightCallback={setRightCallback}
                />
              </Grid>
            {(window.innerWidth > 480 ? 
              <Grid item xs>
                <Paper className={classes.paper}></Paper>
              </Grid>
              : <div></div>
            )}
            </Grid>
            <div className={classes.btnContainer}>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
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
              <Grid item className={classes.pstable} xs={12}>
                <PSTable
                  intake={data.intake}
                  spec={data.spec}
                  trans={right}
                  transCode={[]}
                  shortLimit={shortTriCHLimit}
                  longLimit={longTriCHLimit}
                />
              </Grid>
              <Grid item xs>
                <Paper className={classes.paper}></Paper>
              </Grid>
            </Grid>
            <div className={classes.btnContainer}>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {tablesToExcel(e, ['ps-table-y1','ps-table-y2','ps-table-y3'], ['Year1','Year2','Year3'], 'ProgrammeStructure.xls', 'Excel')}}
                className={classes.button}
              >
                Export to Excel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}