import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyATMsBtN05rmvMobkZ4cWfEcWpmPRdO_n0",
  authDomain: "ig-clone-22.firebaseapp.com",
  projectId: "ig-clone-22",
  storageBucket: "ig-clone-22.appspot.com",
  messagingSenderId: "889349083779",
  appId: "1:889349083779:web:05c24da30b10f132dec1b6",
  measurementId: "G-THF87FJ77L",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
