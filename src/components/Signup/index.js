import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Paper,
  Avatar,
  Typography,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
} from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validatePassword2,
} from './validators';
import styles from './styles';

const initialState = {
  username: '',
  email: '',
  password: '',
  password2: '',
  errors: {
    username: '',
    email: '',
    password: '',
    password2: '',
    server: '',
  },
}

class SignupFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...initialState,
    }
  }

  handleChange = name => e => {
    e.preventDefault();
    const { target: { value } } = e;
    const { password } = this.state;
    const errors = {};
    switch (name) {
      case 'username':
        errors.username = validateUsername(value)
          ? ''
          : 'Username must have at least 4 characters.';
        break;
      case 'email':
        errors.email = validateEmail(value)
          ? ''
          : 'Email address not valid.';
        break;
      case 'password':
        errors.password = validatePassword(value)
          ? ''
          : 'Password must have at least 6 characters.';
        break;
      case 'password2':
        errors.password2 = validatePassword2(value, password)
          ? ''
          : 'Passwords must match.';
        break;
      default:
        break;
    }
    this.setState(prevState => {
      return {
        [name]: value,
        errors,
      }
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { username, email, password } = this.state;
    const { firebase: { auth }, history } = this.props;
    auth.createUserWithEmailAndPassword(email, password)
      .then(cred => {
        const { user } = cred;
        return user.updateProfile({
          displayName: username,
        });
      })
      .then(() => {
        history.push('/');
      })
      .catch(err => {
        this.setState({
          errors: {
            server: err.message,
          },
        });
      });
  }

  validateForm() {
    const {
      username,
      email,
      password,
      password2,
      errors,
    } = this.state;
    return !(
      !username ||
      !email ||
      !password ||
      !password2 ||
      !!errors.username ||
      !!errors.email ||
      !!errors.password ||
      !!errors.password2 ||
      !!errors.server
    );
  }

  render() {
    const {
      username,
      email,
      password,
      password2,
      errors,
    } = this.state;
    const { classes } = this.props;
    return (
      <form
        className={classes.form}
        onSubmit={this.handleSubmit}>
        <FormControl required fullWidth error={!!errors.username}>
          <InputLabel
            htmlFor="username"
          >
            Username
          </InputLabel>
          <Input
            id="username"
            name="username"
            value={username}
            autoFocus
            onChange={this.handleChange('username')}
          />
          {errors.username && (
              <FormHelperText>
                {errors.username}
              </FormHelperText>
            )
          }
        </FormControl>
        <FormControl required fullWidth error={!!errors.email}>
          <InputLabel
            htmlFor="email"
          >
            Email Address
          </InputLabel>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={this.handleChange('email')}
          />
          {errors.email && (
              <FormHelperText>
                {errors.email}
              </FormHelperText>
            )
          }
        </FormControl>
        <FormControl required fullWidth error={!!errors.password}>
          <InputLabel
            htmlFor="password"
          >
            Password
          </InputLabel>
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={this.handleChange('password')}
          />
          {errors.password && (
              <FormHelperText>
                {errors.password}
              </FormHelperText>
            )
          }
        </FormControl>
        <FormControl required fullWidth error={!!errors.password2}>
          <InputLabel
            htmlFor="password2"
          >
            Confirm Password
          </InputLabel>
          <Input
            id="password2"
            name="password2"
            type="password"
            value={password2}
            onChange={this.handleChange('password2')}
          />
          {errors.password2 && (
              <FormHelperText>
                {errors.password2}
              </FormHelperText>
            )
          }
        </FormControl>
        <Typography
          align="right"
        >
          Already on Hadar? {' '}
          <Link to="/signin">
            Sign in
          </Link>
        </Typography>
        {errors.server && (
          <Typography
            color="error">
            {errors.server}
          </Typography>
        )}
        <Button
          className={classes.submit}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!this.validateForm()}
        >
          Sign up
        </Button>
      </form>
    );
  }
}

const SignupForm = withStyles(styles)(withRouter(withFirebase(SignupFormBase)));

const Signup = props => {
  const { classes } = props;
  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <SignupForm />
      </Paper>
    </main>
  );
}

export default withStyles(styles)(Signup);
