import { firestore } from "services/firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, orderBy, query } from "firebase/firestore";
import { serverTimestamp, Timestamp } from "firebase/firestore";

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
  const freezersQuery = query(
    collection(firestore, 'users', userId, 'freezers'), 
    orderBy('createdAt', 'asc')
  )
  const freezersSnap = await getDocs(freezersQuery)
  
  const freezers = await Promise.all(
    freezersSnap.docs.map(async (freezerDoc) => {
      const freezerData = { id: freezerDoc.id, ...freezerDoc.data() }

      const shelvesQuery = query(
        collection(firestore, 'users', userId, 'freezers', freezerDoc.id, 'shelves'),
        orderBy('createdAt', 'asc')
      )

      const shelvesSnap = await getDocs(shelvesQuery)

      const shelves = await Promise.all(
        shelvesSnap.docs.map(async (shelfDoc) => {
          const shelfData = { id: shelfDoc.id, ...shelfDoc.data() }

           const productsQuery = query(
            collection(firestore, 'users', userId, 'freezers', freezerDoc.id, 'shelves', shelfDoc.id, 'products'),
            orderBy('createdAt', 'asc')
          )

          const productsSnap = await getDocs(productsQuery)
          const products = productsSnap.docs.map(p => {
            const raw = p.data();
            return {
              id: p.id,
              ...raw,
              freezingDate: raw.freezingDate?.toDate() || null,
              expirationDate: raw.expirationDate?.toDate() || null
            };
          });

          return { ...shelfData, products }
        })
      )

      return { ...freezerData, shelves }
    })
  )

  return freezers
}

//UPDATE

export const editFreezer = async (userId, freezerId, newName) => {
  console.log("Editing freezer:", freezerId, "to", newName);
  if (!newName) throw new Error("New name is required");

  const freezerRef = doc(firestore, "users", userId, "freezers", freezerId);
  await updateDoc(freezerRef, {
    name: newName,
    updatedAt: new Date()
  });
};

export const editShelf = async (userId, freezerId, shelfId, name) => {
  const shelfDocRef = doc(firestore, "users", userId, "freezers", freezerId, "shelves", shelfId);
  await updateDoc(shelfDocRef, {
    name,
    updatedAt: new Date(),
  });
};

export const editProduct = async (
  userId,
  freezerId,
  shelfId,
  productId,
  updateData // Changed parameter structure for clarity
) => {
  // Validate all required IDs
  if (!userId || !freezerId || !shelfId || !productId) {
    throw new Error("Missing required document ID parameters");
  }

  // Ensure all IDs are strings
  const stringIds = [userId, freezerId, shelfId, productId];
  if (stringIds.some(id => typeof id !== "string")) {
    throw new Error("All document IDs must be strings");
  }

  const productDocRef = doc(
    firestore,
    "users", userId,
    "freezers", freezerId,
    "shelves", shelfId,
    "products", productId
  );

  // Handle date conversions
  const processDate = date => {
  if (!date) return null;

  if (typeof date === 'string') {
    // parse "YYYY-MM-DD" into a Date
    const parsed = new Date(date);
    return isNaN(parsed.getTime())
      ? null
      : Timestamp.fromDate(parsed);
  }

  if (date instanceof Date)        return Timestamp.fromDate(date);
  if (date instanceof Timestamp)   return date;

  return null;
};

  const dataToUpdate = {
    ...updateData,
    updatedAt: serverTimestamp(), // Now using the imported function
    freezingDate: processDate(updateData.freezingDate),
    expirationDate: processDate(updateData.expirationDate),
  };

  // Remove undefined values
  Object.keys(dataToUpdate).forEach(key => {
    if (dataToUpdate[key] === undefined) {
      delete dataToUpdate[key];
    }
  });

  await updateDoc(productDocRef, dataToUpdate);
};

// DELETE

export const deleteFreezer = async (userId, freezerId) => {
  const shelvesSnap = await getDocs(
    collection(firestore, "users", userId, "freezers", freezerId, "shelves")
  );

  await Promise.all(
    shelvesSnap.docs.map(async (shelf) => {
      const productsSnap = await getDocs(
        collection(
          firestore,
          "users",
          userId,
          "freezers",
          freezerId,
          "shelves",
          shelf.id,
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
              shelf.id,
              "products",
              product.id
            )
          )
        )
      );

      await deleteDoc(
        doc(firestore, "users", userId, "freezers", freezerId, "shelves", shelf.id)
      );
    })
  );

  await deleteDoc(doc(firestore, "users", userId, "freezers", freezerId));
};


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