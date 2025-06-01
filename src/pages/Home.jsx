import React, { useEffect, useState } from "react";
import {
  createFreezer,
  createShelf,
  createProduct,
  editProduct
} from "../firebase/firestoreService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firestore } from "services/firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";

export default function SeedButton() {
  const [user, setUser] = useState(null);
  const [freezerId, setFreezerId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSeed = async () => {
    if (!user) return alert("Login first");

    try {
      const newFreezerId = await createFreezer(user.uid, "My Freezer");
      setFreezerId(newFreezerId);

      const shelfId = await createShelf(user.uid, newFreezerId, "Shelf 1");

      // Get current date and set expiration to 1 year from now
      const freezingDate = new Date();
      const expirationDate = new Date();
      expirationDate.setFullYear(freezingDate.getFullYear() + 1);

      const productResults = await Promise.all([
        createProduct(
          user.uid,
          newFreezerId,
          shelfId,
          "Peas",
          1,
          "kg",
          "Vegetables",
          freezingDate,
          expirationDate,
          null
        ),
        createProduct(
          user.uid,
          newFreezerId,
          shelfId,
          "Corn",
          500,
          "g",
          "Vegetables",
          freezingDate,
          expirationDate,
          null
        ),
        createProduct(
          user.uid,
          newFreezerId,
          shelfId,
          "Ice Cream",
          6,
          "pops",
          "Dessert",
          freezingDate,
          expirationDate,
          null
        ),
      ]);

      alert(
        `Seeding done!\n` +
          `Freezer: ${newFreezerId}\n` +
          `Shelf: ${shelfId}\n` +
          `Products: ${productResults.map((r) => r.id).join(", ")}`
      );
    } catch (err) {
      console.error("❌ Seeding error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleEditProduct = async () => {
    if (!user || !freezerId ) {
      return alert("Seed products first");
    }

    try {
      const productId = 'B96xt1ZUkuAAdwwDzPBb'; // Use first product
      const newFreezingDate = new Date();
      const newExpirationDate = new Date();
      newExpirationDate.setMonth(newFreezingDate.getMonth() + 6);
      
      // Edit the product with new values
      await editProduct(
        user.uid,
        freezerId,
        productId,
        {
          name: "Edited Peas",
          quantity: 2,
          unit: "bags",
          category: "Premium Vegetables",
          freezingDate: newFreezingDate,
          expirationDate: newExpirationDate,
          regenerateQr: true
        }
      );

      alert(`Product ${productId} updated!\n- Name: Edited Peas\n- Quantity: 2 bags\n- Category: Premium Vegetables`);
    } catch (err) {
      console.error("❌ Edit product error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ display: "grid", gap: "8px" }}>
      <button onClick={handleSeed}>Seed freezer + products</button>
      <button onClick={handleEditProduct} disabled={!freezerId}>
        Edit Freezer
      </button>
    </div>
  );
}
