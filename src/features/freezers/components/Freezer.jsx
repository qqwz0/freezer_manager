import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from 'flowbite-react';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable, sortableKeyboardCoordinates} from '@dnd-kit/sortable'
import { restrictToVerticalAxis, restrictToParentElement, } from '@dnd-kit/modifiers';
import { useFreezerContext } from 'freezers/hooks';

import { Shelf } from 'freezers/components';
import { useModal } from 'shared/hooks';
import { ActionButton, FormModal } from 'shared/ui';

function SortableShelf({ shelf, freezerData }) {
  const { attributes, listeners, setNodeRef, transform, transition} = useSortable({ id: shelf.id})
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Shelf shelf={shelf} freezerData={freezerData} />
    </div>
  );
}

export default function Freezer({ freezerData }) {
  const { config, open, close } = useModal();
  const [isHovered, setIsHovered] = useState(false);

  const {
    addShelf,
    deleteFreezer,
    updateFreezer,
    updateShelfPosition
  } = useFreezerContext();

  const handleEditFreezer = useCallback(() =>
    open({
      mode: 'edit',
      title: "Edit Freezer",
      onSubmit: data => { updateFreezer(freezerData.id, data.name); },
      fields: [
        { key: 'name', label: 'Freezer Name', type: 'text', placeholder: 'Enter freezer name', required: true }
      ],
      initialData: { name: freezerData.name }
    }), [open, updateFreezer, freezerData.id, freezerData.name])

  const handleDeleteFreezer = useCallback(() =>
    open({
      mode: 'delete',
      title: "Delete Freezer",
      onSubmit: () => {deleteFreezer(freezerData.id)},
    }), [open, deleteFreezer, freezerData.id])

  const handleAddShelf = useCallback(() =>
      open({
        mode: 'add',
        title: "Add New Shelf",
        onSubmit: ({ name }) => { addShelf(freezerData.id, name) },
        fields: [
          { key: 'name', label: 'Shelf Name', type: 'text', placeholder: 'Enter shelf name', required: true }
        ],
      }), [open, addShelf, freezerData.id])
    
  const unassignedShelf = useMemo(() => {
    return <Shelf
      key='unassigned'
      shelf={{id: '', name: 'Unassigned Products'}}
      freezerData={freezerData}
    />
  }, [freezerData])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      }
    }),
  );

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = freezerData.shelves.findIndex(s => s.id === active.id);
      const newIndex = freezerData.shelves.findIndex(s => s.id === over.id);
      const newOrder = arrayMove(freezerData.shelves, oldIndex, newIndex)
    
      newOrder.forEach((shelf, index) => {
        if (shelf.order !== index) {
          updateShelfPosition(freezerData.id, shelf.id, index);
        }
      });
    }
  }, [freezerData.shelves, updateShelfPosition, freezerData.id])

  const sortedShelves = useMemo(() => {
    return [...(freezerData.shelves || [])].sort((a, b) => a.order - b.order);
  }, [freezerData.shelves])

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
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={sortedShelves.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {/* Shelves Container - More Compact */}
                <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto scrollbar-thin scrollbar-track-blue-100 scrollbar-thumb-blue-300 dark:scrollbar-track-blue-900 dark:scrollbar-thumb-blue-700 pr-2">
                  {sortedShelves.map(shelf => (
                    <SortableShelf 
                    key={shelf.id}
                    shelf={shelf}
                    freezerData={freezerData}
                    />
                  ))}
                  
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
              </SortableContext >
            </DndContext>
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