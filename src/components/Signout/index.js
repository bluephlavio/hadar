import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

class Signout extends Component {
  componentDidMount() {
    const { firebase: { auth }, history } = this.props;
    auth.signOut()
    .then(() => {
      history.push('/');
    })
    .catch(err => {
      console.log(err.message);
    });
  }

  render() {
    return null;
  }
}

export default withRouter(withFirebase(Signout));
