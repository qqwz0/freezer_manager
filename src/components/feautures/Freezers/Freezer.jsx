import React, { useState, useEffect, useCallback } from 'react';
import { Card } from 'flowbite-react';

import { ActionButton } from 'components/common/Button';
import { EditModal, DeleteModal, Modal } from 'components/common/Modal';
import { Shelf } from 'components/feautures/Shelves';

export default function Freezer( { freezerData, onDeleteFreezer, onEditFreezer, onAddShelf, onUpdateShelf, onRemoveShelf, onAddProduct, onUpdateProduct, onRemoveProduct } ) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
              freezerData={freezerData}
              onRemoveShelf={onRemoveShelf}
              onUpdateShelf={onUpdateShelf}
              onAddProduct={onAddProduct}
              onUpdateProduct={onUpdateProduct}
              onRemoveProduct={onRemoveProduct}
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
          onAddShelf(name);
          setIsModalOpen(false);
        }}
        fields={[{ key: 'name', label: 'Freezer Name', type: 'text', placeholder: 'Enter freezer name', required: true }]}
      ></Modal>

      <EditModal
        show={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={data => {
          onEditFreezer(data.name);
          setIsEditModalOpen(false);
        }}
        title="Freezer"
        fields={[{ key: 'name', label: 'Freezer Name', type: 'text', placeholder: 'Enter freezer name', required: true }]}
        freezerData={{ name: freezerData.name }}
      />

      <DeleteModal
        show={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        onDelete={freezerId => {onDeleteFreezer(freezerId); setShowDeleteModal(false)}} 
        title="Freezer"
      />
    </div>
  );
}