import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Typography,
  Button,
} from '@material-ui/core';
import { withAuth } from '../Auth';

const condition = user => !!user;

const Home = (props) => {
  const { user } = props;
  return (
    <Grid container
      justify="center"
      alignItems="center"
    >
      <Grid item>
        <Typography component="h6" variant="h6">
          Hey {user.displayName},
        </Typography>
      </Grid>
      <Grid item>
        <Button
          variant="text"
          color="secondary"
        >
          <Link to="signout">
            Sign out
          </Link>
        </Button>
      </Grid>
    </Grid>
  );
}

export default withAuth(condition)(Home);
