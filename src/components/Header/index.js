import React from 'react';
import {
  Grid,
  Typography,
} from '@material-ui/core';

const Header = () => (
  <Grid container
    alignItems="center"
    justify="center"
  >
    <Grid item>
      <Typography component="h1" variant="h5">
        Hadar
      </Typography>
    </Grid>
  </Grid>
);

export default Header;
