import { firestore } from "./firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

// CREATE

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

// CREATE
export const createProduct = async (
  userId,
  freezerId,
  shelfId,
  productName,
  quantity = 0,
  unit = "",
  category = "",
  freezingDate = null,
  expirationDate = null
) => {
  if (!productName) throw new Error("Product name is required");
  
  const productData = {
    name: productName,
    quantity,
    unit,
    category,
    createdAt: new Date(),
    freezingDate: freezingDate instanceof Date ? freezingDate : null,
    expirationDate: expirationDate instanceof Date ? expirationDate : null,
  };

  const productRef = await addDoc(
    collection(firestore, "users", userId, "freezers", freezerId, "shelves", shelfId, "products"),
    productData
  );
  return productRef.id;
};

// READ

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

// DELETE

// DELETE 

export const deleteShelf = async (userId, freezerId, shelfId) => {
  const productsSnap = await getDocs(
    collection(
      firestore, 
      "users",
      userId,
      "freezers",
      freezerId,
      "shelves",
      shelfId,
      "products"
    )
  );

  await Promise.all(
    productsSnap.docs.map((product) => 
      deleteDoc(
        doc(
          firestore,
          "users",
          userId,
          "freezers",
          freezerId,
          "shelves",
          shelfId,
          "products",
          product.id
        )
      )
    )
  )

  await deleteDoc(
    doc(
      firestore,
      "users",
      userId,
      "freezers",
      freezerId,
      "shelves",
      shelfId
    )
  );
};

export const deleteProduct = async (userId, freezerId, shelfId, productId) => {
  await deleteDoc(
    doc(
      firestore,
      "users",
      userId,
      "freezers",
      freezerId,
      "shelves",
      shelfId,
      "products",
      productId
    )
  );
}