import { firestore } from "services/firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, updateDoc, limit, doc, orderBy, query, where, getDoc } from "firebase/firestore";
import { serverTimestamp, Timestamp } from "firebase/firestore";

import { uploadToCloudinary } from "services/cloudinary";
import { generateQRBlob }      from "services/qr";


// CREATE

export const createFreezer = async (userId, name) => {
  const freezerRef = await addDoc(collection(firestore, "users", userId, "freezers"), {
    name,
    createdAt: new Date(),
  });
  return freezerRef.id;
};

export const createShelf = async (userId, freezerId, name = "") => {
  if (!freezerId) throw new Error("Freezer ID is required");

  const shelvesCol = collection(
    firestore,
    "users",
    userId,
    "freezers",
    freezerId,
    "shelves"
  );

  const q = query(shelvesCol, orderBy("order", "desc"), limit(1));
  const snap = await getDocs(q);

  let nextOrder = 0;
  if (!snap.empty) {
    const highestOrder = snap.docs[0].data().order;
    nextOrder = (typeof highestOrder === 'number' ? highestOrder : 0) + 1
  }

  const shelfRef = await addDoc(
    shelvesCol,
    { name, createdAt: serverTimestamp(), order: nextOrder, }
  );
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
  expirationDate = null,
  photoFile = null
) => {
  if (!productName) throw new Error("Product name is required");
  if (!freezerId) throw new Error("Freezer ID is required");

  // upload photo if provided
  let photoUrl = "";
  if (photoFile) {
    photoUrl = await uploadToCloudinary(photoFile);
  }

  // Create the product first to get the ID
  const productData = {
    name: productName,
    quantity,
    unit,
    category,
    shelfId,
    createdAt: serverTimestamp(),
    freezingDate: freezingDate instanceof Date ? Timestamp.fromDate(freezingDate) : null,
    expirationDate: expirationDate instanceof Date ? Timestamp.fromDate(expirationDate) : null,
    photoUrl,
    qrCodeUrl: "" // Will be updated after QR generation
  };

  const productsRef = collection(
    firestore,
    "users",
    userId,
    "freezers",
    freezerId,
    "products"
  );
  const productRef = await addDoc(productsRef, productData);

  // Generate QR code with the product ID instead of product name
  const qrBlob = await generateQRBlob(productRef.id);
  const qrCodeUrl = await uploadToCloudinary(qrBlob);

  // Update the product with the QR code URL
  await updateDoc(productRef, { qrCodeUrl });

  return { id: productRef.id, photoUrl, qrCodeUrl };
};

export const createCategory = async (userId, name, selectedImageUrl) => {
  if (!name) throw new Error("Category name is required");

  const docRef = await addDoc(
    collection(firestore, "categories"),
    {
      name,
      imageUrl: selectedImageUrl,
      createdBy: userId,
      createdAt: serverTimestamp(),
    }
  );

  return docRef.id;
};

// READ

export const getUserFreezerData = async (userId) => {
  const freezersQ = query(
    collection(firestore, "users", userId, "freezers"),
    orderBy("createdAt", "asc")
  );
  const freezersSnap = await getDocs(freezersQ);

  const result = [];
  for (const fDoc of freezersSnap.docs) {
    const freezer = { id: fDoc.id, ...fDoc.data(), shelves: [], products: [] };
    // get shelves
    const shelvesQ = query(
      collection(firestore, "users", userId, "freezers", fDoc.id, "shelves"),
      orderBy("createdAt", "asc")
    );
    const shelvesSnap = await getDocs(shelvesQ);
    freezer.shelves = shelvesSnap.docs.map(s => ({ id: s.id, ...s.data() }));

    // get products under this freezer
    const productsQ = query(
      collection(firestore, "users", userId, "freezers", fDoc.id, "products"),
      orderBy("createdAt", "asc")
    );
    const productsSnap = await getDocs(productsQ);
    freezer.products = productsSnap.docs.map(p => {
      const raw = p.data();
      return {
        id: p.id,
        ...raw,
        freezingDate: raw.freezingDate?.toDate() || null,
        expirationDate: raw.expirationDate?.toDate() || null
      };
    });

    result.push(freezer);
  }
  return result;
};

export const getCategoryById = async (categoryId) => {
  if (!categoryId) throw new Error("Category ID is required");
  const docRef = doc(firestore, "categories", categoryId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    throw new Error(`Category with ID ${categoryId} not found`);
  }
  return { id: snap.id, ...snap.data() };
};

export const getAllCategories = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  const categoriesRef = collection(firestore, "categories");

  const globalQuery = query(
    categoriesRef,
    where("createdBy", "==", ""),
    orderBy("createdAt", "asc")
  );

  const userQuery = query(
    categoriesRef,
    where("createdBy", "==", userId),
    orderBy("createdAt", "asc")
  );

  const [globalSnap, userSnap] = await Promise.all([
    getDocs(globalQuery),
    getDocs(userQuery),
  ]);

  const globalCategories = globalSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const userCategories = userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return [...globalCategories, ...userCategories];
};

  export const getAllUnits = async () => {
    try {
      const unitsSnapshot = await getDocs(collection(firestore, 'units'));
      const units = unitsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return units;
    } catch (error) {
      console.error('Error fetching units:', error);
      return [];
    }
  };

//UPDATE

export const editFreezer = async (userId, freezerId, newName) => {
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

export const updateShelfOrder = async (
  userId,
  freezerId,
  shelfId, 
  newOrder
) => {
  if (!freezerId) throw new Error("Freezer ID is required");
  if (!shelfId)   throw new Error("Shelf ID is required");

  console.log('newOrder', newOrder)

  const shelfRef = doc(
    firestore,
    "users",
    userId,
    "freezers",
    freezerId,
    "shelves",
    shelfId
  );

  // Оновлюємо тільки поле order
  await updateDoc(shelfRef, { order: newOrder });
};

export const editProduct = async (
  userId,
  freezerId,
  productId,
  updateData = {}
) => {
  if (!userId || !freezerId || !productId) throw new Error("Missing identifiers");
  
  // Extract special fields
  const { 
    photoFile, 
    regenerateQr, 
    freezingDate, 
    expirationDate, 
    shelfId, 
    ...rest 
  } = updateData;

  // 1. SANITIZE DATA - Remove any File/Blob objects
  const sanitizedRest = Object.entries(rest).reduce((acc, [key, value]) => {
    if (!(value instanceof File) && !(value instanceof Blob)) {
      acc[key] = value;
    }
    return acc;
  }, {});

  // 2. PREPARE BASE UPDATE
  const dataToUpdate = { 
    ...sanitizedRest, 
    updatedAt: serverTimestamp() 
  };

  // 3. HANDLE SHELF ID
  if (updateData.hasOwnProperty('shelfId')) {
  // explicitly allow empty string or null
    dataToUpdate.shelfId = shelfId === "" ? null : shelfId;
  }

  // 4. HANDLE DATES
  const toTimestamp = (date) => {
    if (!date) return null;
    if (date instanceof Date) return Timestamp.fromDate(date);
    if (date instanceof Timestamp) return date;
    if (typeof date === 'string') return Timestamp.fromDate(new Date(date));
    return null;
  };

  if (freezingDate) dataToUpdate.freezingDate = toTimestamp(freezingDate);
  if (expirationDate) dataToUpdate.expirationDate = toTimestamp(expirationDate);

  // 5. HANDLE PHOTO UPLOAD (convert File to URL)
  if (photoFile) {
    const newUrl = await uploadToCloudinary(photoFile);
    dataToUpdate.photoUrl = newUrl;
  }

  // 6. HANDLE QR REGENERATION
  if (regenerateQr) {
    const qrBlob = await generateQRBlob(`${productId}|${Date.now()}`);
    const qrUrl = await uploadToCloudinary(qrBlob);
    dataToUpdate.qrCodeUrl = qrUrl;
  }

  // 7. PERFORM THE UPDATE
  const prodRef = doc(
    firestore,
    "users",
    userId,
    "freezers",
    freezerId,
    "products",
    productId
  );
  
  await updateDoc(prodRef, dataToUpdate);
};

export const editCategory = async (categoryId, updateData = {}) => {
  if (!Object.keys(updateData).length) {
    throw new Error("No data provided for update");
  }

  const categoryDocRef = doc(firestore, "categories", categoryId);
  await updateDoc(categoryDocRef, {
    ...updateData,
    updatedAt: serverTimestamp(),
  });
};

// DELETE

export const deleteFreezer = async (userId, freezerId) => {
  // delete all products
  const productsQ = collection(
    firestore,
    "users",
    userId,
    "freezers",
    freezerId,
    "products"
  );
  const prodSnap = await getDocs(productsQ);
  await Promise.all(prodSnap.docs.map(p => deleteDoc(p.ref)));

  // delete all shelves
  const shelvesQ = collection(
    firestore,
    "users",
    userId,
    "freezers",
    freezerId,
    "shelves"
  );
  const shelvesSnap = await getDocs(shelvesQ);
  await Promise.all(shelvesSnap.docs.map(s => deleteDoc(s.ref)));

  // delete freezer
  const freezerRef = doc(firestore, "users", userId, "freezers", freezerId);
  await deleteDoc(freezerRef);
};


export const deleteShelf = async (userId, freezerId, shelfId) => {
  // reassign or delete products on that shelf as needed before deletion
  const productsQ = query(
    collection(
      firestore,
      "users",
      userId,
      "freezers",
      freezerId,
      "products"
    ),
    where("shelfId", "==", shelfId)
  );
  const snap = await getDocs(productsQ);
  await Promise.all(
    snap.docs.map(p => deleteDoc(p.ref))
  );

  const shelfRef = doc(
    firestore,
    "users",
    userId,
    "freezers",
    freezerId,
    "shelves",
    shelfId
  );
  await deleteDoc(shelfRef);
};

export const deleteProduct = async (userId, freezerId, productId) => {
  const prodRef = doc(
    firestore,
    "users",
    userId,
    "freezers",
    freezerId,
    "products",
    productId
  );
  await deleteDoc(prodRef);
};

export const deleteCategory = async (categoryId) => {
  const categoryRef = doc(firestore, "categories", categoryId);
  await deleteDoc(categoryRef);
}