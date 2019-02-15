import React, { Component } from 'react';
import AuthContext from './context';
import { withFirebase } from '../Firebase';

class AuthProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: JSON.parse(localStorage.getItem('user')),
    }
  }

  componentDidMount() {
    const { firebase: { auth } } = this.props;
    auth.onAuthStateChanged(user => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.setState({
          user,
        });
      } else {
        localStorage.removeItem('user');
        this.setState({
          user: null,
        });
      }
    });
  }

  render() {
    const { user } = this.state;
    const { children } = this.props;
    return (
      <AuthContext.Provider value={user}>
        {children}
      </AuthContext.Provider>
    );
  }
}

export default withFirebase(AuthProvider);
