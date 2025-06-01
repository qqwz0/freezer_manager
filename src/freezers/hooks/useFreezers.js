import { useState, useEffect, useCallback } from 'react';
import {
  getUserFreezerData,
  createFreezer,
  editFreezer,
  deleteFreezer,
  createShelf,
  editShelf,
  deleteShelf,
  createProduct,
  editProduct,
  deleteProduct,
} from 'services/firestoreService';
import { useAuth } from 'contexts/AuthContext';

export default function useFreezers() {
    const user = useAuth();
    const [freezers, setFreezers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;
        setLoading(true);

        const fetchData = async () => {
            try {
                const data = await getUserFreezerData(user.uid);
                setFreezers(Array.isArray(data) ? data : [data]);
            } catch (e) {
                console.error("Error fetching freezer data:", e);
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Create a new freezer
    const add = useCallback(async (name) => {
        if (!name) return;
        setLoading(true);

        try {
            const id = await createFreezer(user.uid, name);
            setFreezers(prev => [...prev, {id: id, name: name.trim(), shelves: []}]);
        } catch (e) {
            console.error(e);
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [user])

    // Rename an existing freezer
    const update = useCallback(async (id, newName) => {
        setLoading(true);
        try {
            await editFreezer(user.uid, id, newName);
            setFreezers(prevList => 
                prevList.map(f => f.id === id ?
                    { ...f, name: newName } 
                    : f
                )
            );
        } catch (e) {
            console.error(e);
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [user])
    
    // Delete a freezer
    const remove = useCallback(async id => {
        setLoading(true);
        try {
            await deleteFreezer(user.uid, id);
            setFreezers(prev => prev.filter(f => f.id !== id));
        } catch (e) {
            console.error(e);
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Add a shelf to a freezer
    const addShelf = useCallback(async (freezerId, shelfName) => {
        if (!shelfName || !freezerId) return;
        setLoading(true);

        try {
            const shelfId = await createShelf(user.uid, freezerId, shelfName.trim());
            setFreezers(prev => 
                prev.map(f => 
                    f.id === freezerId 
                    ? {
                        ...f, 
                        shelves: [
                            ...f.shelves, 
                            { id: shelfId, name: shelfName.trim()}
                        ]
                    }
                    : f
                )
            );
        } catch (e) {
            console.error(e);
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const updateShelf = useCallback(async (freezerId, shelfId, newName) => {
        if (!newName || !freezerId) return;
        setLoading(true);

        try {
            await editShelf(user.uid, freezerId, shelfId, newName);
            setFreezers(prev => 
                prev.map(f => 
                    f.id === freezerId
                    ? {
                        ...f, 
                        shelves: f.shelves.map(s => 
                            s.id === shelfId
                            ? { ...s, name: newName.trim() }
                            : s
                        )
                    }
                    : f
                )
            );
        } catch (e) {
            console.error(e);
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [user])

    // Delete a shelf
    const removeShelf = useCallback(async (freezerId, shelfId) => {
        try {
            await deleteShelf(user.uid, freezerId, shelfId);
            setFreezers(prev => 
                prev.map(f => 
                    f.id === freezerId 
                    ? {
                        ...f, 
                        shelves: f.shelves.filter(s => s.id !== shelfId)
                    }
                    : f
                )
            )
        } catch (e) {
            console.error(e);
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [user]);


    const parseDMY = (str) => {
        if (!str) return undefined;
        const parts = str.includes('.') ? str.split('.') : str.split('/');
        if (parts.length !== 3) return undefined;
        const [day, month, year] = parts.map(Number);
        return new Date(year, month - 1, day);
    };


    const addProduct = useCallback(async (freezerId, shelfId, product) => {
        if (!product || !freezerId) return;
        try {
            const freezingDateObj = product.freezingDate instanceof Date
                ? product.freezingDate
                : parseDMY(product.freezingDate);
            const expirationDateObj = product.expirationDate instanceof Date
                ? product.expirationDate
                : parseDMY(product.expirationDate);
            const photoFile = product.picture || null;

            const {
                id: productId,
                photoUrl,
                qrCodeUrl
            } = await createProduct(
                user.uid,
                freezerId,
                shelfId,
                product.name,
                product.quantity,
                product.unit,
                product.category,
                freezingDateObj,
                expirationDateObj,
                photoFile
            );

            setFreezers(prev => prev.map(f => f.id === freezerId ? ({
                ...f,
                products: [...(f.products || []), {
                        id: productId,
                        shelfId: shelfId,
                        name: product.name,
                        quantity: product.quantity,
                        unit: product.unit,
                        category: product.category,
                        freezingDate: freezingDateObj,
                        expirationDate: expirationDateObj,
                        photoUrl,
                        qrCodeUrl
                    }]
            }) : f));
        } catch (e) {
            console.error(e);
            setError(e);
        }
    }, [user]);

    const updateProduct = useCallback(async (freezerId, shelfId, productId, updatedProduct) => {
      if (!updatedProduct || !freezerId) return;

      try {
        await editProduct(
          user.uid,
          freezerId,
          productId,
          updatedProduct
        );

        setFreezers(prev => 
                prev.map(
                    f => 
                        f.id === freezerId
                        ? {
                            ...f,
                            products: f.products.map(
                                p => 
                                    p.id === productId
                                    ? {
                                        ...p,
                                        ...updatedProduct,
                                        freezingDate: typeof updatedProduct.freezingDate === 'string'
                                            ? new Date(updatedProduct.freezingDate)
                                            : updatedProduct.freezingDate,
                                        expirationDate: typeof updatedProduct.expirationDate === 'string'
                                            ? new Date(updatedProduct.expirationDate)
                                            : updatedProduct.expirationDate
                                    }
                                    : p
                            )
                        }
                        : f 
                )
            )
      } catch (error) {
        console.error('Error updating product:', error);
        setError(error);
      }
    }, [user]);

    const removeProduct = useCallback(async (freezerId, shelfId, productId) => {
       if (!productId || !freezerId) return;

      try {
        // 1) Видаляємо з Firestore
        await deleteProduct(user.uid, freezerId, productId)

        // 2) Оновлюємо локальний стейт для миттєвого ререндеру
        setFreezers(prev => 
                prev.map(
                    f => 
                        f.id === freezerId
                        ? {
                            ...f,
                            products: f.products.filter(p => p.id !== productId)
                        }
                        : f 
                )
            )
      } catch (e) {
        console.error('Error deleting product:', e)
        setError(e)
      }
    },
    [user]
  )

  const getUnassignedProducts = useCallback(() => {
    return freezers.flatMap(freezer =>
      (freezer.products || [])
        .filter(product => product.shelfId === '')
        .map(product => ({
          ...product,
          freezerId: freezer.id
        }))
    );
  }, [freezers]);


    return {
        freezers,
        loading,
        error,
        addFreezer: add,
        updateFreezer: update,
        deleteFreezer: remove,
        addShelf,
        updateShelf,
        removeShelf,
        addProduct,
        updateProduct,
        removeProduct,
        getUnassignedProducts
    }
}