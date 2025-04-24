import { auth, firestore } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const signup = async (email, password) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCred.user;
  await setDoc(doc(firestore, 'users', user.uid), { email: user.email, uid: user.uid });
  return user;
};

export const login = async (email, password) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
};
