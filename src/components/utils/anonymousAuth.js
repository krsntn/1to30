import firebase from 'firebase';

export const signIn = (callback = null) => {
  firebase
    .auth()
    .signInAnonymously()
    .then(callback);
};

export const signOut = () => {
  firebase.auth().signOut();
};
