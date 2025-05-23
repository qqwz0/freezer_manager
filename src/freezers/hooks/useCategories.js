import { useState, useEffect, useCallback } from 'react';
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  editCategory
} from 'services/firestoreService';
import { useAuth } from 'contexts/AuthContext';

export default function useFreezers() {
    const user = useAuth();
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const data = await getAllCategories(user.uid);
                setCategories(Array.isArray(data) ? data : [data]);
            } catch (e) {
                console.error("Error fetching freezer data:", e);
                setError(e);
            }
        };

        fetchData();
    }, [user]);

    return {
        categories,
        error
    }
}