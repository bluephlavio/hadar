import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';

const ThemeProvider = props => {
  const { children } = props;
  return (
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
