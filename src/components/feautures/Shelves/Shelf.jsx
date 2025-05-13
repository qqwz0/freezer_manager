import React, { useState, useCallback } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle
} from 'flowbite-react';

import { editShelf } from 'services/firestoreService';
import { useAuth }   from 'contexts/AuthContext';

import { ShelfProduct }                   from 'components/feautures/Shelves';
import { ActionButton }  from 'components/common/Button';
import { DeleteModal, EditModal }         from 'components/common/Modal';

export default function Shelf({ shelf, freezerId, onDeleteShelf, onAddProduct, onUpdateShelf }) {
  const user = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleAddProduct = () => {
    console.log("Add Product clicked");
  }

  const confirmDeleteShelf = () => {
    onDeleteShelf(shelf.id);
    setShowDeleteModal(false);
  }

  const handleEditShelf = useCallback(async ({ name }) => {
    try {
      await editShelf(user.uid, freezerId, shelf.id, name);

      onUpdateShelf(freezerId, shelf.id, name);
      setShowEditModal(false);
    } catch (e) {
      console.error(e);
      alert('Error updating shelf. Please try again.')
    }
  }, [user.uid, freezerId, shelf.id, onUpdateShelf])

  console.log("Shelf data:", shelf);

  return (
    <>
      <Accordion collapseAll>
        <AccordionPanel>
          <AccordionTitle 
              className='cursor-pointer flex flex-row justify-between items-center w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg p-5' // Added background and hover classes
            >
                <div className='flex flex-row gap-2 items-center'>
                  {shelf.name}
                  <ActionButton
                    onClick={() => {setShowEditModal(true); console.log("Edit shelf")}}
                    action="edit"
                  />
                  <ActionButton onClick={() => setShowDeleteModal(true)} action="delete"/>
                </div>
              </AccordionTitle>
              <AccordionContent className='flex flex-col gap-2 cursor-pointer'>
                {shelf.products.map(product => (
                  <ShelfProduct 
                    key={product.id} 
                    product={product} 
                    className='flex flex-row justify-between items-center w-full'
                  />
                ))}
                <ActionButton label="Product" onClick={handleAddProduct} action="add" />
              </AccordionContent>
          </AccordionPanel>
      </Accordion>

      <DeleteModal
        show={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        onDelete={confirmDeleteShelf} 
        title="Shelf"
      />

      <EditModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEdit={handleEditShelf}
        title="Shelf"
        fields={[
          { key: 'name', label: 'Shelf Name', type: 'text', placeholder: 'Enter shelf name', required: true },
        ]}
        freezerData={{ name: shelf.name }}
      />
    </>
  )
}
