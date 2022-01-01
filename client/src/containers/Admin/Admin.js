import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Login from '../../components/Admin/Login';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import EditSubjectList from '../../components/Admin/EditSubjectList';
import EditSPS from '../../components/Admin/EditSPS';

const useStyles = makeStyles((theme) => ({
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

export default function Admin(props) {
  const classes = useStyles();
  const [token, setToken] = React.useState(getToken());
  const [activeTab, setActiveTab] = React.useState(0);
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     token: getToken(),
  //     activeTab: 0,
  //   }
  // }

  const callbackFunction = (childData) => {
    setToken(childData);
    // this.setState({token: childData});
  }
  
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
    // this.setState({activeTab: newValue});
  };

  // DEBUG
  if(!token) {
    return <Login setToken={setToken} parentCallback={callbackFunction} />
  }

  return (
    <div className={classes.container}>
      <Paper className={classes.root}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Edit Subject List" {...a11yProps(0)}/>
          <Tab label="Edit Programme Structure" {...a11yProps(1)}/>
        </Tabs>
      </Paper>
      <TabPanel value={activeTab} index={0}>
        <EditSubjectList />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <EditSPS />
      </TabPanel>
    </div>
  );
};