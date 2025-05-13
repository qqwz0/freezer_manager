import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Shelf } from 'components/feautures/Shelves';
import { Card } from 'flowbite-react';
import {
  getUserFreezerData,
  createShelf,
  deleteShelf,
  deleteFreezer,
  editFreezer
} from '../../../firebase/firestoreService';
import { ActionButton } from 'components/common/Button';
import { EditModal, DeleteModal } from 'components/common/Modal';
import { Modal } from 'components/common/Modal';

export default function Freezer( { freezerData, setFreezerData, onDeleteFreezer, onEditFreezer, onEditShelf } ) {
  const user = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  // UPDATE FREEZER DATA
  const handleEditFreezer = useCallback(async ({ name }) => {
    try {
      await editFreezer(user.uid, freezerData.id, name);
      setFreezerData(prev => ({ ...prev, name: name }));

      const updated = {
        ...freezerData,
        name: name
      }

      setFreezerData(updated);
      onEditFreezer?.(updated); // carousel state update
      setIsEditModalOpen(false);
    } catch (e) {
      console.error(e);
      alert('Error updating freezer. Please try again.');
    }
  }, [user.uid, freezerData.id, setFreezerData]);

  // DELETE FREEZER
  const handleDeleteFreezer = useCallback(async () => {
    if (!freezerData?.id) return;
    
    try {
      await deleteFreezer(user.uid, freezerData.id);
      onDeleteFreezer(freezerData.id);
    } catch (e) {
      console.error(e);
      alert("Error deleting freezer. Please try again.");
    }
  }, [user, freezerData?.id, onDeleteFreezer]);

  // ADD SHELF
  const handleAddShelf = useCallback(async (shelfName) => {
    if (!shelfName || !freezerData?.id) return;

    try {
      const shelfId = await createShelf(user.uid, freezerData.id, shelfName);
      // setFreezerData(prev => ({
      //   ...prev,
      //   shelves: [
      //       ...(Array.isArray(prev.shelves) ? prev.shelves : []),
      //       { id: shelfId, name: shelfName, products: [] }
      //   ]
      // }));
      const updated = {
        ...freezerData,
        shelves: [
          ...freezerData.shelves,
          { id: shelfId, name: shelfName, products: []}
        ]
      }
      setFreezerData(updated);
      onEditFreezer?.(updated);
    } catch (e) {
      console.error(e);
      alert("Error creating shelf. Please try again.");
    }
  }, [user.uid, freezerData, setFreezerData, onEditFreezer]);

  //DELETE SHELF
  const handleDeleteShelf = useCallback(async (shelfId) => {
    try {
      await deleteShelf(user.uid, freezerData.id, shelfId);
      setFreezerData(prev => ({
        ...prev, 
        shelves: prev.shelves.filter(shelf => shelf.id !== shelfId)
      }));
      const updated = {
        ...freezerData,
        shelves: freezerData.shelves.filter(shelf => shelf.id !== shelfId)
      }
      setFreezerData(updated);
    } catch (e) {
      console.error(e);
      alert("Error deleting shelf. Please try again.");
    }
  })

  const confirmDeleteFreezer = () => {
    handleDeleteFreezer();
    setShowDeleteModal(false);
  }

  if (!freezerData || !freezerData.shelves) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className='flex justify-center items-center mb-4'>
        <h1 className="text-2xl font-bold text-center mb-4">{freezerData.name}</h1>
        <ActionButton
          onClick={() => {setIsEditModalOpen(true); console.log("Edit freezer")}}
          action='edit'
        />
        <ActionButton
          onClick={() => {setShowDeleteModal(true); console.log("Delete freezer")}}
          action='delete'
        />
      </div>
      <Card className="max-w-xl mx-auto dark:bg-blue-900">
        <div className="flex flex-col gap-4 pb-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-track-blue-100 scrollbar-thumb-blue-300 dark:scrollbar-track-blue-900 dark:scrollbar-thumb-blue-700">
          {freezerData.shelves.map((shelf) => (
            <Shelf 
              key={shelf.id} 
              shelf={shelf} 
              freezerId={freezerData.id}
              onDeleteShelf={handleDeleteShelf}
              onUpdateShelf={onEditShelf}
              className="bg-white dark:bg-blue-800 rounded-lg p-4 shadow-lg transition-all hover:shadow-xl"
            />
          ))}
          <ActionButton
            onClick={() => {setIsModalOpen(true);}}
            label = "Add Shelf"
            action="submit"
          />
        </div>
      </Card>

      <Modal
        show={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onAdd={({ name }) => {
          handleAddShelf(name);
          setIsModalOpen(false);
        }}
        fields={[{ key: 'name', label: 'Freezer Name', type: 'text', placeholder: 'Enter freezer name', required: true }]}
      ></Modal>

      <EditModal
        show={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditFreezer}
        title="Freezer"
        fields={[{ key: 'name', label: 'Freezer Name', type: 'text', placeholder: 'Enter freezer name', required: true }]}
        freezerData={{ name: freezerData.name }}
      />

      <DeleteModal
        show={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        onDelete={confirmDeleteFreezer} 
        title="Freezer"
      />
    </div>
  );
}