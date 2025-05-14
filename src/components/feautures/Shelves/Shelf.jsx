import React, { useState, useCallback } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle
} from 'flowbite-react';

import { editShelf } from 'services/firestoreService';
import { useAuth }   from 'contexts/AuthContext';
import { createProduct } from 'services/firestoreService';

import { ShelfProduct }                   from 'components/feautures/Shelves';
import { ActionButton }  from 'components/common/Button';
import { DeleteModal, EditModal, Modal }         from 'components/common/Modal';

export default function Shelf({ shelf, freezerId, freezerData, onDeleteShelf, setFreezerData, onUpdateShelf }) {
  const user = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddProduct = useCallback(async (product) => {
    if (!product || !shelf?.id) return;

    try { 
      const productId = await createProduct(user.uid, freezerId, shelf.id, product.name, product.quantity, product.unit, product.category, product.freezingDate, product.expirationDate);
      const updated = {
        ...freezerData,
        shelves: freezerData.shelves.map(s => {
          return s.id === shelf.id
            ? {
                ...s,
                products: [
                  ...s.products,
                  {
                    id: productId,
                    name: product.name,
                    quantity: product.quantity,
                    unit: product.unit,
                    category: product.category,
                    freezingDate: product.freezingDate,
                    expirationDate: product.expirationDate
                  }
                ]
              }
            : s;
        })
      };
      setFreezerData(updated);
    } catch (e) {
      console.error(e);
      alert('Error adding product. Please try again.');
    }
  }, [user.uid, freezerId, shelf])

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
                <ActionButton label="Product" onClick={() => setIsModalOpen(true)} action="add" />
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

      <Modal 
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProduct}
        fields={[
          { key: 'name', label: 'Product Name', type: 'text', placeholder: 'Enter product name', required: true },
          { key: 'quantitty', label: 'Quantity', type: 'number', placeholder: 'Enter quantity', required: true },
          { key: 'unit', label: 'Unit', type: 'text', placeholder: 'Enter unit', required: true },
          { key: 'category', label: 'Category', type: 'text', placeholder: 'Enter category', required: false },
          { key: 'freezingDate', label: 'Freezing Date', type: 'date', placeholder: 'Enter freezing date', required: false },
          { key: 'expirationDate', label: 'Expiration Date', type: 'date', placeholder: 'Enter expiration date', required: false },
        ]}
      />
    </>
  )
}
