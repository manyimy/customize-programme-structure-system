import React, { useEffect } from 'react';
// import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import axios from 'axios';
const API_PATH = process.env.REACT_APP_API_PATH;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  btnSL: {
    width: "100%",
    marginTop: 30
  },
  listPaper:  {
    width: "60vw",
    marginLeft: "auto",
    marginRight: "auto",
    ['@media (max-width:1023px)']: {
      width: "70vw",
      marginLeft: "auto",
      marginRight: "auto",
    },
    ['@media (max-width:733px)']: {
      width: "90vw",
    },
    marginBottom: "15px",
    height: "70vh",
    overflowY: "scroll",
  },
  gridContainer: {
    width: "60vw",
    marginLeft: "auto",
    marginRight: "auto",
    ['@media (max-width:1023px)']: {
      width: "70vw",
      marginLeft: "auto",
      marginRight: "auto",
    },
    ['@media (max-width:733px)']: {
      width: "90vw",
    },
  },
  codeInput: {
    // marginRight: "20px",
  },
  addBtnGrid: {
    display: "flex",
    justifyContent: "right",
    alignItems: "center",
  },
  addBtn: {
    float: "right"
  },
  multiSelect: {
    margin: theme.spacing(1,1,1,0),
    minWidth: "100%",
    maxWidth: "100%",
  },
  prereq: {
    '&::-webkit-scrollbar': {
      display: "none"
    }
  },
  inputFullWidth: {
    width: "100%"
  },
  inputSelection: {
    marginRight: "0px"
  }
}));

export default function EditSubjectList(props) {
  const classes = useStyles();

  const [subjects, setSubjects] = React.useState(new Map());
  const [openAddPop, setOpenAddPop] = React.useState(false);
  const [addPopMsg, setAddPopMsg] = React.useState('');
  const [alertSev, setAlertSev] = React.useState('error');
  const [newCode, setNewCode] = React.useState('');
  const [newSubject, setNewSubject] = React.useState('');
  const [newCH, setNewCH] = React.useState('');
  const [newOffer, setNewOffer] = React.useState([]);
  const [newPreReq, setNewPreReq] = React.useState([]);
  // const [errorCode, setErrorCode] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [deletingItem, setDeletingItem] = React.useState(null);
  const [removeMsg, setRemoveMsg] = React.useState('');

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     subjects: [],
  //     openAddPop: false,
  //     addPopMsg: '',
  //     alertSev: 'error',
  //     newCode: '',
  //     newSubject: '',
  //     newCH: '',
  //     newOffer: [],
  //     newPreReq: [],
  //     errorCode: false,
  //     openDialog: false,
  //     deletingItem: null,
  //     removeMsg: ''
  //   }
  // }

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 200;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4 + ITEM_PADDING_TOP,
        // width: 400,
      },
    },
  };

  useEffect(() => {
    axios.get( API_PATH + "/subjectList.json")
      .then((response) => {
        setSubjects(new Map(response.data));
        // this.setState({
        //   subjects: response.data.sort((a, b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0))
        // })
      });
  }, []);

  // const onChange = (event) => {
  //   const { name } = event.target;
  //   this.setState({
  //     [name]: (name === "newCH") ? Number(event.target.value) : event.target.value
  //   });
  // }

  const handleCloseSnackbar = () => {
    setOpenAddPop(false);
    // this.setState({openAddPop: false});
  };

  const handleDelete = (e) => {
    e.preventDefault();
    var list = subjects;
    list.delete(deletingItem);
    // setSubjects(list);
    // this.setState({
    //   subjects: list
    // });
    axios.post(API_PATH + '/subjectList', {
      subjects: list
    }).then((res) => {
      setAddPopMsg('Subject list updated successfully.');
      setAlertSev('success');
      setOpenAddPop(true);
      // this.setState({
      //   addPopMsg: 'Subject list updated successfully.',
      //   alertSev: 'success',
      //   openAddPop: true,
      //   openList: false
      // });
    }).catch((err) => {
      console.log(err);
    });

    handleCloseDialog(e);
  };

  const handleAdd = (event) => {
    event.preventDefault();
    
    var list = subjects;
    // if(list.filter(e => e.code === newCode || e.name === newSubject).length > 0) {
    if(list.has(newCode)) {
      setAddPopMsg('Subject name or code has already existed.');
      setAlertSev('error');
      setOpenAddPop(true);
      // this.setState({
      //   addPopMsg: 'Subject name or code has already existed.', 
      //   alertSev: 'error',
      //   openAddPop: true
      // });
    } else {
      list.set(newCode.trim(), {
        name: newSubject.trim(),
        ch: newCH,
        offer: newOffer,
        prereq: newPreReq
      });
      setSubjects(list);
      setNewCode('');
      setNewSubject('');
      setNewCH('');
      setNewOffer([]);
      setNewPreReq([]);
      // this.setState({
      //   subjects: list,
      //   newCode: '',
      //   newSubject: '',
      //   newCH: '',
      //   newPreReq: []
      // });
      axios.post(API_PATH + '/subjectList', {
        subjects: list
      }).then((res) => {
        setAddPopMsg('Subject list updated successfully.');
        setAlertSev('success');
        setOpenAddPop(true);
        // this.setState({
        //   addPopMsg: 'Subject list updated successfully.',
        //   alertSev: 'success',
        //   openAddPop: true,
        //   openList: false
        // });
      }).catch((err) => {
        console.log(err);
      });
    }
  };

  const handleOpenDialog = (event, key) => {
    event.preventDefault();
    setDeletingItem(key);
    setRemoveMsg("Are you sure to remove " + key + " " + subjects.get(key).name + " permanently?");
    setOpenDialog(true);
    // this.setState({
    //   deletingItem: index,
    //   removeMsg: "Are you sure to remove " + this.state.subjects[index].code + " " + this.state.subjects[index].name + " permanently?",
    //   openDialog: true
    // });
  }

  const handleCloseDialog = (event) => {
    event.preventDefault();
    setDeletingItem(null);
    setOpenDialog(false);
    // this.setState({
    //   deletingItem: null,
    //   openDialog: false
    // });
  }

  // const handleChangePreReq = (event) => {
  //   setNewPreReq(event.target.value);
  //   // this.setState({newPreReq: event.target.value});
  // };

  // const handleChangeOffer = (event) => {
  //   setNewOffer(event.target.value.sort());
  //   // this.setState({newOffer: event.target.value});
  // };

  return (
    <div className={classes.root}>
      <Paper className={classes.listPaper} elevation={2}>
        <List dense={true}>
          {Array.from(subjects.entries()).map((entry) => {
            const [key, value] = entry;
            const labelId = `checkbox-list-label-${key}`;

            return (
              <ListItem >
                <ListItemText id={labelId} style={{textAlign: "left", width: "65%", marginRight: "10px"}} primary={`${key} \t-\t ${value.name}`} />
                <ListItemText style={{textAlign: "right", width: "5%", marginRight: "5px"}} primary={`${value.offer}`} />
                <ListItemText style={{textAlign: "right", width: "10%"}} primary={<Typography className={classes.prereq} style={{overflow: "scroll"}}>{value.prereq.toString()}</Typography>} />
                <ListItemText style={{textAlign: "right", marginRight: "5px"}} primary={`${value.ch} CH`} />
                <IconButton onClick={(e) => {handleOpenDialog(e, key)}} style={{width: "min-content"}} edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            );
          })}
        </List>
      </Paper>
      <Grid container spacing={1} className={classes.gridContainer}>
        <Grid item xs={2}>
          <TextField
            className={classes.codeInput}
            margin="dense"
            id="code"
            name="newCode"
            placeholder="Code"
            inputProps={{ maxLength: 8 }}
            // error= {errorCode}
            onChange={(e) => {setNewCode(e.target.value)}}
            variant="outlined"
            // helperText={ errorCode ? "Invalid format: ABC1234" : ""}
            value={newCode}
          />            
        </Grid>
        <Grid item xs={3}>
          <TextField
            required
            margin="dense"
            className={classes.inputFullWidth}
            name="newSubject"
            placeholder="Subject Name"
            variant="outlined"
            onChange={(e) => {setNewSubject(e.target.value)}}
            value={newSubject}
          />
        </Grid>
        <Grid item xs={2}>
          <FormControl className={classes.inputFullWidth}>
            <TextField
              required
              margin="dense"
              id="ch"
              name="newCH"
              type="number"
              placeholder="Credit Hour"
              variant="outlined"
              onChange={(e) => {setNewCH(Number(e.target.value))}}
              value={newCH}
              inputProps={{ 'min': 1, 'max': 8 }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl className={classes.multiSelect}>
            <Select
              multiple
              displayEmpty
              value={newOffer}
              onChange={(e) => {setNewOffer(e.target.value.sort())}}
              input={<OutlinedInput margin="dense"/>}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <div style={{font: "inherit", color: "#aaa"}}>Offers In</div>;
                }

                return selected.join(', ');
              }}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label'}}
            >
              <MenuItem disabled value="">
                <div style={{font: "inherit", color: "#aaa"}}>Offers In</div>
              </MenuItem>
              {[1,2,3].map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl className={classes.multiSelect}>
            <Select
              multiple
              displayEmpty
              value={newPreReq}
              onChange={(e) => {setNewPreReq(e.target.value)}}
              input={<OutlinedInput margin="dense"/>}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <div style={{font: "inherit", color: "#aaa"}}>Prerequisites</div>;
                }

                return selected.join(', ');
              }}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label'}}
            >
              <MenuItem disabled value="">
                <div style={{font: "inherit", color: "#aaa"}}>Prerequisites</div>
              </MenuItem>
              {Array.from(subjects.entries()).map((entry) => {
                const [key, value] = entry;
                return (
                <MenuItem key={key} value={key}>
                  {key + ' - ' + value.name}
                </MenuItem>
              );})}
            </Select>
          </FormControl>
        </Grid>
        <Grid className={classes.addBtnGrid} item xs={1}>
          <Button
            className={classes.addBtn}
            id="add-subject-button"
            variant="contained"
            onClick={handleAdd} 
            color="primary"
            disabled={
              (newCode && newSubject 
                && newCH && (newOffer.length != 0)
                // && this.state.newCode.match(/[A-Z]{3}[0-9]{4}/)
                ) 
                ? false : true
            }
          >
            Add
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={openAddPop} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={alertSev}>
          {addPopMsg}
        </Alert>
      </Snackbar>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Remove subject from list?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {removeMsg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}