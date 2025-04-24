// src/components/SeedButton.jsx
import React from "react";
import { createFreezer, createShelf, createProduct } from "../firebase/firestoreService";
import { getAuth } from "firebase/auth";

export default function Home() {
  const handleClick = async () => {
    const user = getAuth().currentUser;
    if (!user) {
      alert("Login first");
      return;
    }

    try {
      // Створюємо морозильник
      const freezerId = await createFreezer(user.uid, "My Freezer");
      console.log("✅ Freezer ID:", freezerId);

      // Створюємо полицю
      const shelfId = await createShelf(user.uid, freezerId, "Shelf 1");
      console.log("✅ Shelf ID:", shelfId);

      // Створюємо продукти паралельно та збираємо їхні ID
      const productPromises = [
        createProduct(user.uid, freezerId, shelfId, "Peas", 1, "kg"),
        createProduct(user.uid, freezerId, shelfId, "Corn", 500, "g"),
        createProduct(user.uid, freezerId, shelfId, "Ice Cream", 6, "pops"),
      ];
      const productIds = await Promise.all(productPromises);
      console.log("✅ Product IDs:", productIds);

      alert(`Seeding done!\nFreezer: ${freezerId}\nShelf: ${shelfId}\nProducts: ${productIds.join(", ")}`);
    } catch (err) {
      console.error("❌ Seeding error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <button onClick={handleClick}>
      Seed freezer
    </button>
  );
}
