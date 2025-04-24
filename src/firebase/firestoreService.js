import { firestore } from "./firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

export const createFreezer = async (userId, name) => {
  const freezerRef = await addDoc(collection(firestore, "users", userId, "freezers"), {
    name,
    createdAt: new Date(),
  });
  return freezerRef.id;
};

export const createShelf = async (userId, freezerId, name = "") => {
  const shelfRef = await addDoc(collection(firestore, "users", userId, "freezers", freezerId, "shelves"), {
    name,
    createdAt: new Date(),
  });
  return shelfRef.id;
};

export const createProduct = async (userId, freezerId, shelfId, productName, quantity = 0, unit = "") => {
  if (!productName) throw new Error("Product name is required");
  const productRef = await addDoc(
    collection(firestore, "users", userId, "freezers", freezerId, "shelves", shelfId, "products"),
    {
      name: productName,
      quantity,
      unit,
      createdAt: new Date(),
    }
  );
  return productRef.id;
};

export const getUserFreezerData = async (userId) => {
  const freezersSnap = await getDocs(collection(firestore, 'users', userId, 'freezers'))
  
  const freezers = await Promise.all(freezersSnap.docs.map(async (freezerDoc) => {
    const freezerData = { id: freezerDoc.id, ...freezerDoc.data() }

    const shelvesSnap = await getDocs(collection(firestore, 'users', userId, 'freezers', freezerDoc.id, 'shelves'))

    const shelves = await Promise.all(shelvesSnap.docs.map(async (shelfDoc) => {
      const shelfData = { id: shelfDoc.id, ...shelfDoc.data() }

      const productsSnap = await getDocs(collection(firestore, 'users', userId, 'freezers', freezerDoc.id, 'shelves', shelfDoc.id, 'products'))
      const products = productsSnap.docs.map(p => ({ id: p.id, ...p.data() }))

      return { ...shelfData, products }
    }))

    return { ...freezerData, shelves }
  }))

  return freezers
}