import React, { useState, useEffect, useCallback } from 'react';
import { Card } from 'flowbite-react';

import { Shelf } from 'freezers/components';
import { useModal } from 'shared/hooks';
import { ActionButton, FormModal } from 'shared/ui';

export default function Freezer( { freezerData, onDeleteFreezer, onEditFreezer, onAddShelf, onUpdateShelf, onRemoveShelf, onAddProduct, onUpdateProduct, onRemoveProduct } ) {
  const { config, open, close } = useModal();

  return (
    <div className="container mx-auto p-4">
      <div className='flex justify-center items-center mb-4'>
        <h1 className="text-2xl font-bold text-center">{freezerData.name}</h1>
        <ActionButton
          onClick={() =>
            open({
              mode: 'edit',
              title: "Freezer",
              onSubmit: data => { onEditFreezer(data.name); },
              fields: [
                { key: 'name', label: 'Freezer Name', type: 'text', placeholder: 'Enter freezer name', required: true }
              ],
              initialData: { name: freezerData.name }
            })
          }
          action='edit'
        />
        <ActionButton
          onClick={() =>
            open({
              mode: 'delete',
              title: "Freezer",
              onSubmit: freezerId => {onDeleteFreezer(freezerId)},
            })
          }
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
            onClick={() =>
            open({
              mode: 'add',
              title: "Shelf",
              onSubmit: ({ name }) => { onAddShelf(name) },
              fields: [
                { key: 'name', label: 'Shelf Name', type: 'text', placeholder: 'Enter shelf name', required: true }
              ],
            })
          }
            label = "Add Shelf"
            action="submit"
          />
        </div>
      </Card>

      <FormModal
        show={config.mode !== null}
        mode={config.mode}
        title={config.title}
        fields={config.fields}
        initialData={config.initialData}
        onSubmit={config.onSubmit}
        onClose={close}
      />
    </div>
  );
}