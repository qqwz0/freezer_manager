// Freezer.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext'
import { Shelf } from './Shelf'
import { Card } from 'flowbite-react'
import { getUserFreezerData, createShelf, deleteShelf } from '../firebase/firestoreService'
import AddButton from './AddButton'
import AddModal from './Modal'

export default function Freezer() {
  const user = useAuth();
  const [freezerData, setFreezerData] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const data = await getUserFreezerData(user.uid);
        setFreezerData(data[0]);
      } catch (error) {
        console.error("Error fetching freezer data:", error);
      }
    };

    fetchData();
  }, [user]);

  const handleAddShelf = useCallback(async (shelfName) => {
    if (!shelfName || !freezerData?.id) return;

    try {
      const shelfId = await createShelf(user.uid, freezerData.id, shelfName);
      setFreezerData(prev => ({
        ...prev,
        shelves: [
          ...prev.shelves, 
          { 
            id: shelfId, 
            name: shelfName, 
            products: [] 
          }
        ]
      }));
    } catch (e) {
      console.error(e);
      alert("Error creating shelf. Please try again.");
    }
  }, [user, freezerData?.id]);

  const handleDeleteShelf = useCallback(async (shelfId) => {
    try {
      await deleteShelf(user.uid, freezerData.id, shelfId);
      setFreezerData(prev => ({
        ...prev, 
        shelves: prev.shelves.filter(shelf => shelf.id !== shelfId)
      }));
    } catch (e) {
      console.error(e);
      alert("Error deleting shelf. Please try again.");
    }
  })

  if (!freezerData || !freezerData.shelves) {
    return <div>Loading...</div>;
  }

  console.log("Freezer data:", freezerData);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">{freezerData.name}</h1>
      <Card className="max-w-xl mx-auto dark:bg-blue-900">
        <div className="flex flex-col gap-4 pb-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-track-blue-100 scrollbar-thumb-blue-300 dark:scrollbar-track-blue-900 dark:scrollbar-thumb-blue-700">
          {freezerData.shelves.map((shelf) => (
            <Shelf 
              key={shelf.id} 
              shelf={shelf} 
              onDeleteShelf={handleDeleteShelf}
              className="bg-white dark:bg-blue-800 rounded-lg p-4 shadow-lg transition-all hover:shadow-xl"
            />
          ))}
          <AddButton
            onClick={() => {setIsModalOpen(true);}}
            label = "Shelf"
            action={"Add"}
          />
        </div>
      </Card>

      <AddModal
        show={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onAdd={(name) => {
          handleAddShelf(name);
          setIsModalOpen(false);
        }}
        required
        title="Shelf"
      ></AddModal>
    </div>
  );
}