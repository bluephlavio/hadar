import app from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyC0ibyghUFvzWorkd0Efyo1zftxSTCo5g0",
  authDomain: "hadar-app.firebaseapp.com",
  databaseURL: "https://hadar-app.firebaseio.com",
  projectId: "hadar-app",
  storageBucket: "hadar-app.appspot.com",
  messagingSenderId: "1044802356293",
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
  }
}

export default Firebase;
