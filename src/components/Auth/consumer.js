import React from 'react';
import AuthContext from './context';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

const withAuth = condition => Component => {
  class AuthConsumer extends React.Component {
    componentDidMount() {
      const { firebase: { auth }, history } = this.props;
      this.listener = auth.onAuthStateChanged(user => {
        if (!condition(user)) {
          history.push('/signin');
        }
      });
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthContext.Consumer>
          {user =>
            condition(user)
              ? <Component {...this.props} user={user} />
              : null
          }
        </AuthContext.Consumer>
      )
    }
  }

  return withRouter(withFirebase(AuthConsumer));
}

export default withAuth;
