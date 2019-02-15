import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from '../Header';
import Home from '../Home';
import Signup from '../Signup';
import Signin from '../Signin';
import Signout from '../Signout';
import { FirebaseProvider } from '../Firebase';
import { AuthProvider } from '../Auth';
import { ThemeProvider } from '../Theme';

const App = props => (
  <FirebaseProvider>
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <React.Fragment>
            <Header />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/signin" component={Signin} />
              <Route exact path="/signout" component={Signout} />
            </Switch>
          </React.Fragment>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  </FirebaseProvider>
);

export default App;
