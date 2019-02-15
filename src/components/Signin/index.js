import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Paper,
  Typography,
  Avatar,
  FormControl,
  InputLabel,
  Input,
  Button,
} from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import Background from '../Background';
import styles from './styles';

const initialState = {
  email: '',
  password: '',
  errors: {
    server: '',
  },
}

class SigninFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...initialState,
    };
  }

  handleChange = name => e => {
    e.preventDefault();
    const { target: { value } } = e;
    this.setState({
      [name]: value,
      errors: {
        server: '',
      },
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;
    const { firebase: { auth } } = this.props;
    auth.signInWithEmailAndPassword(email, password)
      .then(cred => {
        this.props.history.push('/');
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
      email,
      password,
    } = this.state;
    return !(
      !email ||
      !password
    );
  }

  render() {
    const { errors } = this.state;
    const { classes } = this.props;
    return (
      <form
        className={classes.form}
        onSubmit={this.handleSubmit}>
        <FormControl required fullWidth>
          <InputLabel htmlFor="email">Email Address</InputLabel>
          <Input
            id="email"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={this.handleChange('email')}
          />
        </FormControl>
        <FormControl required fullWidth>
          <InputLabel html="password">Password</InputLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            onChange={this.handleChange('password')}
          />
        </FormControl>
        <Typography
          align="right"
        >
          New to Hadar? {' '}
          <Link to="/signup">
            Sign up
          </Link>
        </Typography>
        {errors.server && (
          <Typography
            color="error"
            variant="body2"
          >
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
          Sign in
        </Button>
      </form>
    );
  }
}

const SigninForm = withStyles(styles)(withRouter(withFirebase(SigninFormBase)));

const Signin = props => {
  const { classes } = props;
  return (
    <main className={classes.main}>
      <Background />
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <SigninForm classes={classes} />
      </Paper>
    </main>
  );
}

export default withStyles(styles)(Signin);
