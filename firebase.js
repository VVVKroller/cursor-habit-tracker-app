import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDLGxHXrW1hy4O1_Kqf70r7rCzbkQPcJ5M",
    authDomain: "habittracketapp.firebaseapp.com",
    projectId: "habittracketapp",
    storageBucket: "habittracketapp.firebasestorage.app",
    messagingSenderId: "518814638924",
    appId: "1:518814638924:web:79391095fa6087860ea5e9",
    measurementId: "G-NKFZP39WVC"
  };
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };