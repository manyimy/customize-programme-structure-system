import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Login from '../../components/Admin/Login';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import EditSubjectList from '../../components/Admin/EditSubjectList';
// import EditTriMonths from '../../components/Admin/EditTriMonths';
import EditSPS from '../../components/Admin/EditSPS';

const useStyles = withStyles((theme) => ({
  container: {
    alignItems: "center",
  },
  root: {
    flexGrow: 1,
  },
}));

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.token
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  activeTab: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default useStyles(class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: getToken(),
      activeTab: 0,
    }
  }

  callbackFunction = (childData) => {
    this.setState({token: childData})
  }
  
  render(){
    const { classes } = this.props;

    const handleChange = (event, newValue) => {
      this.setState({activeTab: newValue});
    };

    // DEBUG
    if(!this.state.token) {
      return <Login setToken={setToken} parentCallback={this.callbackFunction} />
    }

    return (
      <div className={classes.container}>
        <Paper className={classes.root}>
          <Tabs
            value={this.state.activeTab}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            {/* <Tab label="Edit Trimesters Month" {...a11yProps(0)}/> */}
            <Tab label="Edit Subject List" {...a11yProps(0)}/>
            <Tab label="Edit Programme Structure" {...a11yProps(1)}/>
          </Tabs>
        </Paper>
        {/* <TabPanel value={this.state.value} index={0}>
          <EditTriMonths />
        </TabPanel> */}
        <TabPanel value={this.state.activeTab} index={0}>
          <EditSubjectList />
        </TabPanel>
        <TabPanel value={this.state.activeTab} index={1}>
          <EditSPS />
        </TabPanel>
      </div>
    );
  }
});