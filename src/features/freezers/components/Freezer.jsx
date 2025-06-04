import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from 'flowbite-react';

import { Shelf } from 'freezers/components';
import { useModal } from 'shared/hooks';
import { ActionButton, FormModal } from 'shared/ui';

export default function Freezer({
  freezerData,
  onDeleteFreezer,
  onEditFreezer,
  onAddShelf,
  onUpdateShelf,
  onRemoveShelf,
  onAddProduct,
  onUpdateProduct,
  onRemoveProduct
}) {
  const { config, open, close } = useModal();
  const [isHovered, setIsHovered] = useState(false);

  const handleEditFreezer = useCallback(() =>
    open({
      mode: 'edit',
      title: "Edit Freezer",
      onSubmit: data => { onEditFreezer(data.name); },
      fields: [
        { key: 'name', label: 'Freezer Name', type: 'text', placeholder: 'Enter freezer name', required: true }
      ],
      initialData: { name: freezerData.name }
    }), [open, onEditFreezer, freezerData.name])

  const handleDeleteFreezer = useCallback(() =>
    open({
      mode: 'delete',
      title: "Delete Freezer",
      onSubmit: freezerId => {onDeleteFreezer(freezerId)},
    }), [open, onDeleteFreezer, freezerData.id])

  const handleAddShelf = useCallback(() =>
      open({
        mode: 'add',
        title: "Add New Shelf",
        onSubmit: ({ name }) => { onAddShelf(name) },
        fields: [
          { key: 'name', label: 'Shelf Name', type: 'text', placeholder: 'Enter shelf name', required: true }
        ],
      }), [open, onAddShelf])

  const shelvesList = useMemo(() => {
    if (!freezerData.shelves) return null;

    return freezerData.shelves.map((shelf) => (
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
          />
      ));
  }, [freezerData.shelves, freezerData, onRemoveShelf, onUpdateShelf, onAddProduct, onUpdateProduct, onRemoveProduct]);

  const unassignedShelf = useMemo(() => {
    return <Shelf
      key='unassigned'
      shelf={{id: '', name: 'Unassigned Products'}}
      freezerId={freezerData.id}
      freezerData={freezerData}
      onRemoveShelf={onRemoveShelf}
      onUpdateShelf={onUpdateShelf}
      onAddProduct={onAddProduct}
      onUpdateProduct={onUpdateProduct}
      onRemoveProduct={onRemoveProduct}
      className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/30 dark:to-blue-900/20 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-dashed border-gray-300 dark:border-gray-600 backdrop-blur-sm"
    />
  }, [freezerData, onRemoveShelf, onUpdateShelf, onAddProduct, onUpdateProduct, onRemoveProduct])

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Compact Header */}
      <div className="relative mb-4">
        <div className="flex items-center justify-center mb-3 group">
          <div className="relative">
            <h1 className="text-2xl font-bold text-center white px-3 pr-1">
              {freezerData.name}
            </h1>
          </div>
          
          <div className="flex items-center">
            <ActionButton
              onClick={handleEditFreezer}
              action='edit'
              className="p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200 hover:scale-110"
            />
            <ActionButton
              onClick={handleDeleteFreezer}
              action='delete'
              className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 hover:scale-110"
            />
          </div>
        </div>
        
        {/* Compact Stats Bar */}
        <div className="flex justify-center mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">
                  {freezerData.shelves?.length || 0} Shelves
                </span>
              </div>
              <div className="w-px h-3 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">
                   {freezerData.products?.length || 0} Products
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Card */}
      <Card 
        className="max-w-3xl mx-auto dark:bg-gradient-to-br dark:from-gray-800 dark:to-blue-900/20 bg-gradient-to-br from-white to-blue-50/50 shadow-xl border-0 backdrop-blur-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-t-lg"></div>
          
          <div className="p-4">
            {/* Shelves Container - More Compact */}
            <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto scrollbar-thin scrollbar-track-blue-100 scrollbar-thumb-blue-300 dark:scrollbar-track-blue-900 dark:scrollbar-thumb-blue-700 pr-2">
              {shelvesList}
              
              {/* Unassigned Products Shelf */}
              {unassignedShelf}

              {/* Add Shelf Button */}
              <div className="flex justify-center mt-3">
                <ActionButton
                  onClick={handleAddShelf}
                  label="Add New Shelf"
                  action="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 text-sm"
                />
              </div>
            </div>
          </div>
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
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}