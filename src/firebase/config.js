import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, addDoc, } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

/**
 * Create a new user account and store in Firestore
 */
export const signup = async (email, password) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCred.user;
  console.log('Registered user:', user);
  // записуємо у Firestore документ user.uid з email
  await setDoc(doc(firestore, 'users', user.uid), { email: user.email, uid: user.uid });
  return user;
};

/**
 * Sign in existing user
 */
export const login = async (email, password) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  const user = userCred.user;
  console.log('Logged in user:', user);
  return user;
};

/**
 * Create a new freezer for a user
 * @param {string} userId
 * @param {string} name
 * @returns {Promise<string>} freezer document id
 */

export const createFreezer = async (userId, name) => {
  const freezerRef = await addDoc(
    collection(firestore, "users", userId, "freezers"),
    {
      name,
      createdAt: new Date(),
    }
  );
  console.log("Freezer created with ID:", freezerRef.id);
  return freezerRef.id;
};

// створюємо полицю у користувача->морозильника
export const createShelf = async (userId, freezerId, name = "") => {
  const shelfRef = await addDoc(
    collection(firestore, "users", userId, "freezers", freezerId, "shelves"),
    {
      name,
      createdAt: new Date(),
    }
  );
  console.log("Created shelf:", shelfRef.id);
  return shelfRef.id;
};

// створюємо продукт у користувача->морозильника->полиці
export const createProduct = async (
  userId,
  freezerId,
  shelfId,
  productName,
  quantity = 0,
  unit = ""
) => {
  if (!productName) throw new Error("Product name is required");
  const productRef = await addDoc(
    collection(
      firestore,
      "users",
      userId,
      "freezers",
      freezerId,
      "shelves",
      shelfId,
      "products"
    ),
    {
      name: productName,
      quantity,
      unit,
      createdAt: new Date(),
    }
  );
  console.log("Created product:", productRef.id);
  return productRef.id;
};