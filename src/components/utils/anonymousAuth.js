import firebase from 'firebase';

export const signIn = () => {
  firebase.auth().signInAnonymously();
};

export const signOut = () => {
  firebase.auth().signOut();
};
