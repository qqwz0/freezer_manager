// Freezer.jsx
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Shelf } from './Shelf'
import { Card } from 'flowbite-react'
import { getUserFreezerData } from '../firebase/firestoreService'

export default function Freezer() {
  const [freezerData, setFreezerData] = React.useState(null);
  const user = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const data = await getUserFreezerData(user.uid);
      setFreezerData(data[0]);
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (!user) {
      console.log('User is not authenticated yet');
      return;
    }

    console.log(freezerData);
    console.log(user.uid); // Safe to access user.uid here
  }, [freezerData, user]);

  if (!freezerData || !freezerData.shelves) {
    return <div>Loading...</div>; // You can display a loading message or fallback UI here
  }

  return (
    <Card className="max-w-sm dark:bg-blue-900 w-3xl min-h-20">
      {freezerData.shelves.map((shelf) => (
        <Shelf key={shelf.id} shelf={shelf} />
      ))}
    </Card>
  );
}
