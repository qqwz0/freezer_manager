import React, { createContext, useContext, useMemo, useCallback } from 'react'
import { useFreezers, useCategories } from 'freezers/hooks';

const FreezerContext = createContext(null);

export function FreezerProvider({ children }) {
    const {
    freezers,
    loading,
    error,
    addFreezer,
    updateFreezer,
    deleteFreezer,
    addShelf,
    updateShelf,
    updateShelfPosition,
    removeShelf,
    addProduct,
    updateProduct,
    removeProduct,
  } = useFreezers();

  const { categories, units } = useCategories();

  const value = useMemo(() => ({
    freezers,
    loading,
    error,
    categories,
    units,
    addFreezer,
    updateFreezer,
    deleteFreezer,
    addShelf,
    updateShelf,
    updateShelfPosition,
    removeShelf,
    addProduct,
    updateProduct,
    removeProduct,
  }), [
    freezers,
    loading,
    error,
    categories,
    units,
    addFreezer,
    updateFreezer,
    deleteFreezer,
    addShelf,
    updateShelf,
    updateShelfPosition,
    removeShelf,
    addProduct,
    updateProduct,
    removeProduct,
  ]);

  return (
    <FreezerContext.Provider value={value}>
        {children}
    </FreezerContext.Provider>
  )
}

export function useFreezerContext() {
    const ctx = useContext(FreezerContext);
    if (!ctx) {
        throw new Error('useFreezerContext must be used within a FreezerProvider');    
    }
    return ctx;
}