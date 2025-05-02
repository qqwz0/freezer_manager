import React, { useEffect, useState } from "react";
import {
  createFreezer,
  createShelf,
  createProduct,
  editFreezer,
  deleteFreezer,
} from "../firebase/firestoreService";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function SeedButton() {
  const [user, setUser] = useState(null);
  const [freezerId, setFreezerId] = useState(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSeed = async () => {
    if (!user) {
      alert("Login first");
      return;
    }

    try {
      const newFreezerId = await createFreezer(user.uid, "My Freezer");
      setFreezerId(newFreezerId);

      const shelfId = await createShelf(user.uid, newFreezerId, "Shelf 1");

      const productPromises = [
        createProduct(user.uid, newFreezerId, shelfId, "Peas", 1, "kg"),
        createProduct(user.uid, newFreezerId, shelfId, "Corn", 500, "g"),
        createProduct(user.uid, newFreezerId, shelfId, "Ice Cream", 6, "pops"),
      ];
      const productIds = await Promise.all(productPromises);

      alert(`Seeding done!\nFreezer: ${newFreezerId}\nShelf: ${shelfId}\nProducts: ${productIds.join(", ")}`);
    } catch (err) {
      console.error("❌ Seeding error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleCreateFreezer = async () => {
    if (!user) {
      alert("Login first");
      return;
    }
    try {
      const newFreezerId = await createFreezer(user.uid, "My Freezer");
      setFreezerId(newFreezerId);
      console.log("Created:", newFreezerId);
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  const handleEditFreezer = async () => {
    if (!user || !freezerId) return alert("Login or create freezer first");
    try {
      await editFreezer(user.uid, freezerId, "Renamed Freezer");
      console.log("Edited:", freezerId);
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  const handleDeleteFreezer = async () => {
    if (!user || !freezerId) return alert("Login or create freezer first");
    try {
      await deleteFreezer(user.uid, freezerId);
      setFreezerId(null);
      console.log("Deleted:", freezerId);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div>
      <button onClick={handleSeed}>Seed freezer</button>
      <button onClick={handleCreateFreezer}>Create Freezer</button>
      <button onClick={handleEditFreezer} disabled={!freezerId}>Edit Freezer</button>
      <button onClick={handleDeleteFreezer} disabled={!freezerId}>Delete Freezer</button>
    </div>
  );
}
