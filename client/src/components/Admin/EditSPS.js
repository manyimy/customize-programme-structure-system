import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import MuiAlert from '@material-ui/lab/Alert';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import axios from 'axios';
const API_PATH = process.env.REACT_APP_API_PATH;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = withStyles((theme) => ({
  tableCont: {
    display: "none",
  },
  table: {
    width: "70vw",
    marginLeft: "auto",
    marginRight: "auto",
    overflowX: "visible"
  },
  tableBody: {
    overflowY: "scroll",
  },
  btnGrpCont: {
    textAlign: "center",
    marginBottom: "20px",
  },
  typoh1: {
    textAlign: "center"
  },
  gridContainer: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  codeInput: {
    marginRight: "20px",
  },
  addBtn: {
    float: "right"
  }
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
];

const rows1 = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
];

const rows2 = [
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
];

export default useStyles(class EditSPS extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      psList: [],
      trimesters: [],
      activeIndex: null,
      tri1PS: [],
      tri2PS: [],
      tri3PS: [],
      editingPS: [],
    }
  }

  componentDidMount() {
    axios.get( API_PATH + "/trimesters.json")
      .then((response) => {
        this.setState({
          trimesters: response.data
        });
      });
    for(let i = 1; i < 4; i++){
      let name = "tri" + i + "PS";
      console.log(name)
      axios.get( API_PATH + "/" + name + ".json")
        .then((ps) => {
          console.log(ps.data);
          this.setState({
            [name]: ps.data
          });
        }).catch((err) => {
          console.log(err);
        });
    }
  }

  onClickTriBtns = (e, index) => {
    e.preventDefault();

    let selectedTriPS = (index === 1) ? this.state.tri1PS 
                        : (index === 2) ? this.state.tri2PS 
                          : this.state.tri3PS;
    this.setState({editingPS: selectedTriPS});

    this.setState({activeIndex: index-1});
    document.getElementById("psTable-container").style.display = "block";
  }
  
  render(){
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.btnGrpCont}>
          <ButtonGroup aria-label="outlined primary button group">
            {this.state.trimesters.map((item, index) => {
              return(
                <Button
                  variant={(this.state.activeIndex === index) ? "contained" : "outlined"}
                  color="primary"
                  onClick={(e) => {this.onClickTriBtns(e, index + 1)}}
                >{ "Trimester " + (index + 1) }
                </Button>
              );
            })}
          </ButtonGroup>
        </div>
        <Paper id="psTable-container" className={classes.tableCont}>
          <TableContainer className={classes.table}>
            <h1 className={classes.typoh1}>Year 1</h1>
            <Table className={classes.table} size="small" stickyHeader aria-label="caption table">
              <caption>
                <Grid container spacing={3} className={classes.gridContainer}>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="category"
                      placeholder="Category"
                      // onChange={this.onChange.bind(this)}
                      value={this.state.newSubject}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      className={classes.codeInput}
                      margin="dense"
                      id="code"
                      placeholder="Code"
                      inputProps={{ maxLength: 7 }}
                      error= {this.state.errorCode}
                      // onChange={this.onChange.bind(this)}
                      // helperText={ this.state.errorCode ? "Invalid format: ABC1234" : ""}
                      // value={this.state.newCode}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="name"
                      placeholder="Subject Name"
                      // onChange={this.onChange.bind(this)}
                      value={this.state.newSubject}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="ch"
                      placeholder="Credit Hour"
                      // onChange={this.onChange.bind(this)}
                      value={this.state.ch}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="defaultTri"
                      placeholder="Default Trimester"
                      // onChange={this.onChange.bind(this)}
                      value={this.state.newSubject}
                    />
                  </Grid>
                  <Grid item xs>
                    <Button
                      className={classes.addBtn}
                      id="add-subject-button"
                      variant="contained"
                      // onClick={handleAdd} 
                      color="primary"
                      // disabled={
                      //   (this.state.newCode && this.state.newSubject && 
                      //     this.state.newCode.match(/[A-Z]{3}[0-9]{4}/)) 
                      //     ? false : true
                      // }
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </caption>
              <TableHead>
                <TableRow>
                  <TableCell width="10%" align="center">Category</TableCell>
                  <TableCell width="15%" align="center">Subject Code</TableCell>
                  <TableCell width="40%" align="center">Subject Name</TableCell>
                  <TableCell width="10%" align="center">CH</TableCell>
                  <TableCell width="15%" align="center">Default Trimester</TableCell>
                  <TableCell width="10%" align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.tableBody}>
                {this.state.editingPS.map((item) => {
                  if(item.defaultYear === 1) {
                    return (
                      <TableRow key={item.key}>
                        <TableCell align="center" component="th" scope="row">
                          {item.type}
                        </TableCell>
                        <TableCell align="center">{item.code}</TableCell>
                        <TableCell>{item.subject}</TableCell>
                        <TableCell align="center">{item.ch}</TableCell>
                        <TableCell align="center">{item.defaultTri}</TableCell>
                        <TableCell align="right">
                          <IconButton>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  } else { return <></> }
                })}
              </TableBody>
            </Table>
            
            <h1 className={classes.typoh1}>Year 2</h1>
            <Table className={classes.table} size="small" stickyHeader aria-label="caption table">
            <caption>
                <Grid container spacing={3} className={classes.gridContainer}>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="category"
                      placeholder="Category"
                      // onChange={this.onChange.bind(this)}
                      value={this.state.newSubject}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      className={classes.codeInput}
                      margin="dense"
                      id="code"
                      placeholder="Code"
                      inputProps={{ maxLength: 7 }}
                      error= {this.state.errorCode}
                      // onChange={this.onChange.bind(this)}
                      // helperText={ this.state.errorCode ? "Invalid format: ABC1234" : ""}
                      // value={this.state.newCode}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="name"
                      placeholder="Subject Name"
                      // onChange={this.onChange.bind(this)}
                      value={this.state.newSubject}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="ch"
                      placeholder="Credit Hour"
                      // onChange={this.onChange.bind(this)}
                      value={this.state.ch}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="defaultTri"
                      placeholder="Default Trimester"
                      // onChange={this.onChange.bind(this)}
                      value={this.state.newSubject}
                    />
                  </Grid>
                  <Grid item xs>
                    <Button
                      className={classes.addBtn}
                      id="add-subject-button"
                      variant="contained"
                      // onClick={handleAdd} 
                      color="primary"
                      // disabled={
                      //   (this.state.newCode && this.state.newSubject && 
                      //     this.state.newCode.match(/[A-Z]{3}[0-9]{4}/)) 
                      //     ? false : true
                      // }
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </caption>
              <TableHead>
                <TableRow>
                  <TableCell width="10%" align="center">Category</TableCell>
                  <TableCell width="15%" align="center">Subject Code</TableCell>
                  <TableCell width="40%" align="center">Subject Name</TableCell>
                  <TableCell width="10%" align="center">CH</TableCell>
                  <TableCell width="15%" align="center">Default Trimester</TableCell>
                  <TableCell width="10%" align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.tableBody}>
                {this.state.editingPS.map((item) => {
                  if(item.defaultYear === 2) {
                    return (
                      <TableRow key={item.key}>
                        <TableCell align="center" component="th" scope="row">
                          {item.type}
                        </TableCell>
                        <TableCell align="center">{item.code}</TableCell>
                        <TableCell>{item.subject}</TableCell>
                        <TableCell align="center">{item.ch}</TableCell>
                        <TableCell align="center">{item.defaultTri}</TableCell>
                        <TableCell align="right">
                          <IconButton>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  } else { return <></> }
                })}
              </TableBody>
            </Table>

            <h1 className={classes.typoh1}>Year 3</h1>
            <Table className={classes.table} size="small" stickyHeader aria-label="caption table">
            <caption>
                <Grid container spacing={3} className={classes.gridContainer}>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="category"
                      placeholder="Category"
                      // onChange={this.onChange.bind(this)}
                      value={this.state.newSubject}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      className={classes.codeInput}
                      margin="dense"
                      id="code"
                      placeholder="Code"
                      inputProps={{ maxLength: 7 }}
                      error= {this.state.errorCode}
                      // onChange={this.onChange.bind(this)}
                      // helperText={ this.state.errorCode ? "Invalid format: ABC1234" : ""}
                      // value={this.state.newCode}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="name"
                      placeholder="Subject Name"
                      // onChange={this.onChange.bind(this)}
                      value={this.state.newSubject}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="ch"
                      placeholder="Credit Hour"
                      // onChange={this.onChange.bind(this)}
                      value={this.state.ch}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      required
                      margin="dense"
                      id="defaultTri"
                      placeholder="Default Trimester"
                      // onChange={this.onChange.bind(this)}
                      value={this.state.newSubject}
                    />
                  </Grid>
                  <Grid item xs>
                    <Button
                      className={classes.addBtn}
                      id="add-subject-button"
                      variant="contained"
                      // onClick={handleAdd} 
                      color="primary"
                      // disabled={
                      //   (this.state.newCode && this.state.newSubject && 
                      //     this.state.newCode.match(/[A-Z]{3}[0-9]{4}/)) 
                      //     ? false : true
                      // }
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </caption>
              <TableHead>
                <TableRow>
                  <TableCell width="10%" align="center">Category</TableCell>
                  <TableCell width="15%" align="center">Subject Code</TableCell>
                  <TableCell width="40%" align="center">Subject Name</TableCell>
                  <TableCell width="10%" align="center">CH</TableCell>
                  <TableCell width="15%" align="center">Default Trimester</TableCell>
                  <TableCell width="10%" align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.tableBody}>
                {this.state.editingPS.map((item) => {
                  if(item.defaultYear === 3) {
                    return (
                      <TableRow key={item.key}>
                        <TableCell align="center" component="th" scope="row">
                          {item.type}
                        </TableCell>
                        <TableCell align="center">{item.code}</TableCell>
                        <TableCell>{item.subject}</TableCell>
                        <TableCell align="center">{item.ch}</TableCell>
                        <TableCell align="center">{item.defaultTri}</TableCell>
                        <TableCell align="right">
                          <IconButton>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  } else { return <></> }
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    );
  }
});