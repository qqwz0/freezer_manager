import React, { useState, useEffect, useCallback } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle
} from 'flowbite-react';

import { ActionButton } from 'components/common/Button';
import { DeleteModal, EditModal, Modal } from 'components/common/Modal';
import { ShelfProduct } from 'components/feautures/Shelves';

export default function Shelf({ shelf, freezerId, onRemoveShelf, onUpdateShelf, onAddProduct, onUpdateProduct, onRemoveProduct }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
                    shelfId={shelf.id}
                    onUpdateProduct={onUpdateProduct}
                    onRemoveProduct={onRemoveProduct}
                    freezerId={freezerId}
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
        onDelete={() => onRemoveShelf(shelf.id)}
        title="Shelf"
      />

      <EditModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEdit={({ name }) => onUpdateShelf(shelf.id, name)}
        title="Shelf"
        fields={[
          { key: 'name', label: 'Shelf Name', type: 'text', placeholder: 'Enter shelf name', required: true },
        ]}
        freezerData={{ name: shelf.name }}
      />

      <Modal 
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={(product) => onAddProduct(shelf.id, product)}
        fields={[
          { key: 'name', label: 'Product Name', type: 'text', placeholder: 'Enter product name', required: true },
          { key: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Enter quantity', required: true },
          { key: 'unit', label: 'Unit', type: 'text', placeholder: 'Enter unit', required: true },
          { key: 'picture', label: 'Picture', type: 'file', placeholder: 'Upload picture', required: false },
          { key: 'category', label: 'Category', type: 'text', placeholder: 'Enter category', required: false },
          { key: 'freezingDate', label: 'Freezing Date', type: 'date', placeholder: 'Enter freezing date', required: false },
          { key: 'expirationDate', label: 'Expiration Date', type: 'date', placeholder: 'Enter expiration date', required: false },
        ]}
      />
    </>
  )
}
