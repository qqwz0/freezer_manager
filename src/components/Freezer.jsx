// Freezer.jsx
import React from 'react'
import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Shelf } from './Shelf'
import { Card } from 'flowbite-react'
import { getUserFreezerData } from '../firebase/firestoreService'
import AddButton from './AddButton'
import { createShelf } from '../firebase/firestoreService'
import { useState } from 'react'
import AddModal from './Modal'

export default function Freezer() {
  const [freezerData, setFreezerData] = React.useState(null);
  const [openModal, setOpenModal] = useState(false); 
  const [modalTitle, setModalTitle] = useState("Add Shelf");
  const user = useAuth();

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

  const handleAddShelf = ( shelfName ) => {
    if (!shelfName) return;

    createShelf(user.uid, freezerData.id, shelfName)
      .then((shelfId) => {
        setFreezerData(prev => ({
          ...prev,
          shelves: [
            ...prev.shelves,
            { id: shelfId, name: shelfName, products: [] }
          ]
        }));
      })
      .catch((error) => {
        console.error("Error creating shelf:", error);
        alert("Failed to create shelf. Please try again.");
      });
  };

  if (!freezerData || !freezerData.shelves) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">{freezerData.name}</h1>
      <Card className="max-w-xl mx-auto dark:bg-blue-900">
        <div className="flex flex-col gap-4 pb-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-track-blue-100 scrollbar-thumb-blue-300 dark:scrollbar-track-blue-900 dark:scrollbar-thumb-blue-700">
          {freezerData.shelves.map((shelf) => (
            <Shelf 
              key={shelf.id} 
              shelf={shelf} 
              className="bg-white dark:bg-blue-800 rounded-lg p-4 shadow-lg transition-all hover:shadow-xl"
            />
          ))}
          <AddButton 
            name="Shelf" 
            handleAddition={() => {setOpenModal(true); setModalTitle("Shelf")}}
          />
        </div>
      </Card>

      <AddModal
        openModal={openModal} 
        setOpenModal={setOpenModal} 
        handleAddition={handleAddShelf}
        title={modalTitle}
      ></AddModal>
    </div>
  );
}