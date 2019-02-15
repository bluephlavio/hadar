import React from 'react';
import FirebaseContext from './context';
import Firebase from './firebase';

const FirebaseProvider = props => {
  const { children } = props;
  return (
    <FirebaseContext.Provider value={new Firebase()}>
      {children}
    </FirebaseContext.Provider>
  );
}

export default FirebaseProvider;
