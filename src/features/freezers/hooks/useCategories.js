import { useState, useEffect, useCallback } from 'react';
import {
  getAllCategories,
  getAllUnits
} from 'services/firestoreService';
import { useAuth } from 'auth';

export default function useFreezers() {
    const { user, loading } = useAuth();
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([])
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const data = await getAllCategories(user.uid);
                const dataUnits = await getAllUnits();
                setCategories(Array.isArray(data) ? data : [data]);
                setUnits(Array.isArray(dataUnits) ? dataUnits : [dataUnits])
            } catch (e) {
                console.error("Error fetching freezer data:", e);
                setError(e);
            }
        };

        fetchData();
    }, [user]);

    const getCategory = useCallback(
        (id) => categories.find(cat => cat.id === id) || null,
        [categories]
    );

    const getUnit = useCallback(
        (id) => units.find(unit => unit.id === id) || null,
        [units]
    );
    
    return {
        categories,
        units,
        error,
        getCategory,
        getUnit
    }
}