import React, { useCallback, useState } from 'react'
import { Card } from 'flowbite-react'
import { ActionButton, FormModal } from 'shared/ui'
import { useModal } from 'shared/hooks'
import { ProductModal } from 'freezers/components'
import { formatDMY } from 'shared/utils'

import { useCategories } from 'freezers/hooks'

function ShelfProduct({ product, shelfId, onRemoveProduct, onUpdateProduct, categories, units, shelves }) {
  const [showProductModal, setShowProductModal] = useState(false)

  const { config, open, close } = useModal();

  const category = categories.find(cat => cat.id === product.category);
  const unit = units.find(un => un.id === product.unit);

  // Calculate expiration status
  const getExpirationStatus = () => {
    if (!product.expirationDate) return null;
    
    const today = new Date();
    const expDate = product.expirationDate?.toDate ? product.expirationDate.toDate() : new Date(product.expirationDate);
    const daysDiff = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return { status: 'expired', days: Math.abs(daysDiff), color: 'red' };
    if (daysDiff <= 3) return { status: 'expiring', days: daysDiff, color: 'orange' };
    if (daysDiff <= 7) return { status: 'soon', days: daysDiff, color: 'yellow' };
    return { status: 'fresh', days: daysDiff, color: 'green' };
  };

  const expirationInfo = getExpirationStatus();

  // Get default category icon if no image
  const getCategoryIcon = (categoryName) => {
    if (!categoryName) return (
      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    );
  }
  console.log(product)

  return (
    <>
      <div 
        className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-3 sm:p-4 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-200 cursor-pointer group"
        onClick={() => setShowProductModal(true)}
      >
        {/* Mobile Layout (sm and below) */}
        <div className="sm:hidden">
          {/* Top Row - Product info and expiration */}
          <div className="flex items-center gap-2 mb-3">
            {/* Category Icon/Image */}
            <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-600/50 transition-colors duration-200">
              {category?.imageUrl ? (
                <img 
                  src={category.imageUrl} 
                  alt={category.name} 
                  className="w-6 h-6 object-cover rounded-md" 
                />
              ) : (
                getCategoryIcon(category?.name)
              )}
            </div>

            {/* Product name and category */}
            <div className="flex-1 min-w-0">
              <div className="text-slate-200 font-medium text-sm truncate group-hover:text-white transition-colors duration-200">
                {product.name}
              </div>
              {category?.name && (
                <div className="text-slate-400 text-xs truncate">
                  {category.name}
                </div>
              )}
            </div>

            {/* Expiration Badge */}
            {expirationInfo && (
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                expirationInfo.color === 'red' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                expirationInfo.color === 'orange' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                expirationInfo.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                'bg-green-500/20 text-green-300 border border-green-500/30'
              }`}>
                {expirationInfo.status === 'expired' ? 'Expired' :
                 expirationInfo.status === 'expiring' ? `${expirationInfo.days}d` :
                 expirationInfo.status === 'soon' ? `${expirationInfo.days}d` : 'Fresh'}
              </div>
            )}
          </div>

          {/* Bottom Row - Quantity and Actions */}
          <div className="flex items-center justify-between">
            {/* Quantity */}
            <div className="flex items-center gap-1 bg-slate-700/30 px-2 py-1 rounded-md">
              <span className="text-slate-200 font-medium text-sm">
                {product.quantity}
              </span>
              {unit?.name && (
                <span className="text-slate-400 text-xs">
                  {unit.name}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1">
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Edit product: ", product);
                  open({
                    mode: 'edit',
                    title: "Edit Product",
                    onSubmit: (newProduct) => {
                      console.log('submitted');
                      onUpdateProduct(shelfId, product.id, newProduct);
                    },
                    fields: [
                      { key: 'name', label: 'Product Name', type: 'text', placeholder: 'Enter product name', required: true },
                      { key: 'shelfId', label: 'Shelf', type: 'select', options: shelves, required: false },
                      { key: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Enter quantity', required: true },
                      { key: 'unit', label: 'Unit', type: 'select', options: units, required: true },
                      { key: 'photoUrl', label: 'Picture', type: 'file', placeholder: 'Upload picture', required: false },
                      { key: 'category', label: 'Category', type: 'select', options: categories, required: false },
                      { key: 'freezingDate', label: 'Freezing Date', type: 'date', placeholder: 'Enter freezing date', required: false },
                      { key: 'expirationDate', label: 'Expiration Date', type: 'date', placeholder: 'Enter expiration date', required: false },
                    ],
                    initialData: {
                      id: product.id,
                      name: product.name,
                      shelfId: shelfId,
                      quantity: product.quantity,
                      unit: product.unit,
                      category: product.category || '',
                      freezingDate: product.freezingDate?.toDate ? product.freezingDate.toDate() : product.freezingDate,
                      expirationDate: product.expirationDate?.toDate ? product.expirationDate.toDate() : product.expirationDate,
                      photoUrl: product.photoUrl || '',
                    }
                  });
                }}
                action="edit"
                className="scale-75 hover:scale-90 transition-transform duration-200"
              />
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  open({
                    mode: 'delete',
                    title: "Delete Product",
                    onSubmit: () => {
                      onRemoveProduct(shelfId, product.id);
                      console.log(product.id);
                    },
                  });
                }}
                action="delete"
                className="scale-75 hover:scale-90 transition-transform duration-200"
              />
            </div>
          </div>
        </div>

        {/* Desktop Layout (sm and above) */}
        <div className="hidden sm:flex justify-between items-center w-full">
          {/* Left side - Product info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Category Icon/Image */}
            <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-600/50 transition-colors duration-200">
              {category?.imageUrl ? (
                <img 
                  src={category.imageUrl} 
                  alt={category.name} 
                  className="w-8 h-8 object-cover rounded-md" 
                />
              ) : (
                getCategoryIcon(category?.name)
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-slate-200 font-medium text-sm truncate group-hover:text-white transition-colors duration-200">
                  {product.name}
                </span>
                
                {/* Expiration Badge */}
                {expirationInfo && (
                  <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    expirationInfo.color === 'red' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    expirationInfo.color === 'orange' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                    expirationInfo.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                    'bg-green-500/20 text-green-300 border border-green-500/30'
                  }`}>
                    {expirationInfo.status === 'expired' ? 'Expired' :
                     expirationInfo.status === 'expiring' ? `${expirationInfo.days}d` :
                     expirationInfo.status === 'soon' ? `${expirationInfo.days}d` : 'Fresh'}
                  </div>
                )}
              </div>
              
              {/* Category name */}
              {category?.name && (
                <span className="text-slate-400 text-xs truncate">
                  {category.name}
                </span>
              )}
            </div>
          </div>

          {/* Right side - Quantity and Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Quantity */}
            <div className="flex items-center gap-1 bg-slate-700/30 px-2 py-1 rounded-md">
              <span className="text-slate-200 font-medium text-sm">
                {product.quantity}
              </span>
              {unit?.name && (
                <span className="text-slate-400 text-xs">
                  {unit.name}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1">
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Edit product: ", product);
                  open({
                    mode: 'edit',
                    title: "Edit Product",
                    onSubmit: (newProduct) => {
                      console.log('submitted');
                      onUpdateProduct(shelfId, product.id, newProduct);
                    },
                    fields: [
                      { key: 'name', label: 'Product Name', type: 'text', placeholder: 'Enter product name', required: true },
                      { key: 'shelfId', label: 'Shelf', type: 'select', options: shelves, required: false },
                      { key: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Enter quantity', required: true },
                      { key: 'unit', label: 'Unit', type: 'select', options: units, required: true },
                      { key: 'photoUrl', label: 'Picture', type: 'file', placeholder: 'Upload picture', required: false },
                      { key: 'category', label: 'Category', type: 'select', options: categories, required: false },
                      { key: 'freezingDate', label: 'Freezing Date', type: 'date', placeholder: 'Enter freezing date', required: false },
                      { key: 'expirationDate', label: 'Expiration Date', type: 'date', placeholder: 'Enter expiration date', required: false },
                    ],
                    initialData: {
                      id: product.id,
                      name: product.name,
                      shelfId: shelfId,
                      quantity: product.quantity,
                      unit: product.unit,
                      category: product.category || '',
                      freezingDate: product.freezingDate?.toDate ? product.freezingDate.toDate() : product.freezingDate,
                      expirationDate: product.expirationDate?.toDate ? product.expirationDate.toDate() : product.expirationDate,
                      photoUrl: product.photoUrl || '',
                    }
                  });
                }}
                action="edit"
                className="scale-90 hover:scale-100"
              />
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  open({
                    mode: 'delete',
                    title: "Delete Product",
                    onSubmit: () => {
                      onRemoveProduct(shelfId, product.id);
                      console.log(product.id);
                    },
                  });
                }}
                action="delete"
                className="scale-90 hover:scale-100 transition-transform duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      <ProductModal 
        show={showProductModal} 
        onClose={() => setShowProductModal(false)} 
        product={product}
        unit={unit}
        category={category}
      />

      <FormModal
        show={config.mode !== null}
        mode={config.mode}
        title={config.title}
        fields={config.fields}
        initialData={config.initialData}
        onSubmit={config.onSubmit}
        onClose={close}
      />
    </>
  )
}

export default ShelfProduct