import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
// import config from "../config/config";

const Firebase = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
});

export const Providers = {
  google: new firebase.auth.GoogleAuthProvider(),
};

export const auth = firebase.auth();

export default Firebase;
