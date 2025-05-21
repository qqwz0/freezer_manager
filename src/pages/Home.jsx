import React, { useEffect, useState } from "react";
import {
  createFreezer,
  createShelf,
  createProduct,
  editFreezer,
  deleteFreezer,
  createCategory,
  getAllCategories,
  // getAllCategoriesByUser,
  deleteCategory,
  editCategory,
} from "../firebase/firestoreService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firestore } from "services/firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, orderBy, query, where } from "firebase/firestore";

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

      const productResults = await Promise.all([
        createProduct(user.uid, newFreezerId, shelfId, "Peas", 1, "kg"),
        createProduct(user.uid, newFreezerId, shelfId, "Corn", 500, "g"),
        createProduct(user.uid, newFreezerId, shelfId, "Ice Cream", 6, "pops"),
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

  const handleSeedCategories = async () => {
    if (!user) return alert("Login first");

    const categories = [
      {
        name: "Dairy",
        imageUrl:
          "https://res.cloudinary.com/dmzp8kowf/image/upload/v1747511879/dairy-products_10582803_rr7nri.png",
      },
      {
        name: "Meat",
        imageUrl:
          "https://res.cloudinary.com/dmzp8kowf/image/upload/v1747511879/meat_10508122_zleoeu.png",
      },
      {
        name: "Fish & Seafood",
        imageUrl:
          "https://res.cloudinary.com/dmzp8kowf/image/upload/v1747511879/seafood_8118952_rqx5bg.jpg",
      },
    ];

    try {
      const ids = await Promise.all(
        categories.map((cat) =>
          createCategory(user.uid, cat.name, cat.imageUrl)
        )
      );
      alert(`Created categories:\n${ids.join("\n")}`);
    } catch (err) {
      console.error("❌ Category seeding error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleGetAllCategories = async () => {
    try {
      const cats = await getAllCategories();
      console.log("All categories:", cats);
      alert(
        `All categories fetched (see console):\n${cats
          .map((c) => `${c.id}: ${c.name}`)
          .join("\n")}`
      );
    } catch (err) {
      console.error("❌ Get all categories error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  // const handleGetMyCategories = async () => {
  //   if (!user) return alert("Login first");
  //   try {
  //     const cats = await getAllCategoriesByUser(user.uid);
  //     console.log("My categories:", cats);
  //     alert(
  //       `Your categories (see console):\n${cats
  //         .map((c) => `${c.id}: ${c.name}`)
  //         .join("\n")}`
  //     );
  //   } catch (err) {
  //     console.error("❌ Get my categories error:", err);
  //     alert(`Error: ${err.message}`);
  //   }
  // };

  const handleDeleteCategory = async () => {
    const id = prompt("Enter category ID to delete:");
    if (!id) return;
    try {
      await deleteCategory(id);
      alert(`Deleted category ${id}`);
    } catch (err) {
      console.error("❌ Delete category error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleCreateFreezer = async () => {
    if (!user) return alert("Login first");
    try {
      const newFreezerId = await createFreezer(user.uid, "My Freezer");
      setFreezerId(newFreezerId);
      console.log("Created:", newFreezerId);
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  const handleEditFreezer = async () => {
    if (!user || !freezerId)
      return alert("Login or create freezer first");
    try {
      await editFreezer(user.uid, freezerId, "Renamed Freezer");
      console.log("Edited:", freezerId);
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  const handleDeleteFreezer = async () => {
    if (!user || !freezerId)
      return alert("Login or create freezer first");
    try {
      await deleteFreezer(user.uid, freezerId);
      setFreezerId(null);
      console.log("Deleted:", freezerId);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const updateSpecificCategory = async () => {
    const id = "JRxig5XhufAI8C3KNGyo"; // manually known to exist
    try {
      const categoryRef = doc(firestore, "categories", id);
      await updateDoc(categoryRef, { name: "Updated Manually" });
      console.log(`✅ Updated category "${id}" successfully`);
    } catch (err) {
      console.error("❌ Manual update error:", err.message);
    }
  };

  return (
    <div style={{ display: "grid", gap: "8px" }}>
      <button onClick={handleSeed}>Seed freezer + products</button>
      <button onClick={handleSeedCategories}>Seed categories</button>
      <button onClick={handleGetAllCategories}>Get all categories</button>
      {/* <button onClick={handleGetMyCategories}>Get my categories</button> */}
      <button onClick={updateSpecificCategory}>Update category</button>  {/* new */}
      <button onClick={handleDeleteCategory}>Delete category</button>
      <hr />
      <button onClick={handleCreateFreezer}>Create Freezer</button>
      <button onClick={handleEditFreezer} disabled={!freezerId}>
        Edit Freezer
      </button>
      <button onClick={handleDeleteFreezer} disabled={!freezerId}>
        Delete Freezer
      </button>
    </div>
  );
}
