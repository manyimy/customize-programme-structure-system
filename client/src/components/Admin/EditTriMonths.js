import React from 'react';
import { withStyles } from '@material-ui/core/styles';
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
  editTriCard: {
    marginLeft: "auto",
    marginRight: "auto",
    minWidth: 275,
    maxWidth: "55vw"
  },
  submitBtn: {
    float: "right",
  },
  select: {
    width: "100%"
  }
}));

export default useStyles(class EditTriMonths extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trimester1: '',
      trimester2: '',
      trimester3: '',
      openSnackbar: false
    }
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
  
  render(){
    const { classes } = this.props;

    const handleChange = (event, tri) => {
      this.setState({[tri]: event.target.value});
    };

    const onSubmitTriMonth = () => {
      var newData = [];
      newData.push(this.state.trimester1);
      newData.push(this.state.trimester2);
      newData.push(this.state.trimester3);
      axios.post(API_PATH + '/trimesters',{
        newData: newData
      }).then((res) => {
        this.setState({openSnackbar: true});
      }).catch((err) => {
        console.log(err);
      });
    }

    const handleCloseSnackbar = () => {
      this.setState({openSnackbar: false});
    };

    return (
      <div>
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
        <Snackbar open={this.state.openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success">
            Trimester months updated successful.
          </Alert>
        </Snackbar>
      </div>
    );
  }
});