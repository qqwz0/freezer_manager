// scripts/seedFreezer.js
import 'dotenv/config';
import { initializeApp } from "firebase/app";
import { getFirestore, query, where, collection, getDocs } from "firebase/firestore";
import { createFreezer, createShelf, createProduct } from "../src/firebaseService.js";

const firestore = getFirestore();

async function seedFreezerForEmail(email) {
  // 1) Знайти користувача по email
  const usersCol = collection(firestore, "users");
  const q = query(usersCol, where("email", "==", email));
  const userSnap = await getDocs(q);
  if (userSnap.empty) {
    throw new Error(`User ${email} not found`);
  }
  const uid = userSnap.docs[0].id;

  // 2) Створити морозильник у користувача
  const freezerId = await createFreezer(uid, "My Freezer");

  // 3) Створити полицю
  const shelfId = await createShelf(uid, freezerId, "Shelf 1");

  // 4) Додати три продукти
  await createProduct(uid, freezerId, shelfId, "Peas", 1, "kg");
  await createProduct(uid, freezerId, shelfId, "Corn", 500, "g");
  await createProduct(uid, freezerId, shelfId, "Ice Cream", 6, "pops");

  console.log("✅ Seeding complete");
}

seedFreezerForEmail("auwdiadhwhdi@gmail.com").catch(console.error);
