import React from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Button,
} from '@material-ui/core';
import { withAuth } from '../Auth';
import Sketch from '../Sketch';

const condition = user => !!user;

const Home = (props) => {
  const { user } = props;
  return (
    <main>
      <Sketch background />
      <Typography
        align="center"
        component="h6"
        variant="h6"
      >
        Hey {user.displayName},
        <Button
          variant="text"
          color="secondary"
        >
          <Link to="signout">
            Sign out
          </Link>
        </Button>
      </Typography>
    </main>
  );
}

export default withAuth(condition)(Home);
