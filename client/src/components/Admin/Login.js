import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import Alert from '@material-ui/lab/Alert';

const useStyles = withStyles((theme) => ({
  loginWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
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

async function loginUser(credentials) {
  return fetch(process.env.REACT_APP_API_PATH + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
 }

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }

  render() {
    const { classes } = this.props;

    const handleSubmit = async e => {
      e.preventDefault();
      var { username, password } = this.state;
      if(username === "admin" && password === "admin123") {     // modify here to change the admin username and password
        const token = await loginUser({
          username,
          password
        });
        this.props.parentCallback(token);
      } else {
        document.getElementById("error-alert").style.display = "flex";
      }
    }

    return(
      <div className={classes.loginWrapper}>
        <Alert id="error-alert" severity="error" className={classes.inputAlert}>Credentials entered are incorrect!</Alert>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Admin Login
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus
                onChange={e => {this.setState({username: e.target.value})}}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={e => {this.setState({password: e.target.value})}}
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Log In
              </Button>
            </form>
          </div>
        </Container>
      </div>
    )
  }
};

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}

export default useStyles(Login);