import { React, useEffect, useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { getUserFreezerData, createShelf, deleteShelf } from '../firebase/firestoreService'
import { useAuth } from '../contexts/AuthContext'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Freezer from './Freezer';

SwiperCore.use([Navigation, Pagination]);

export default function FreezerCarousel() {
    const [freezers, setFreezers] = useState([]);
    
    const user = useAuth();

    useEffect(() => {
        if (!user) return;
    
        const fetchData = async () => {
          try {
            const data = await getUserFreezerData(user.uid);
            setFreezers(Array.isArray(data) ? data : [data]);
          } catch (error) {
            console.error("Error fetching freezer data:", error);
          }
        };
    
        fetchData();
      }, [user, freezers]);

      const handleUpdateOneFreezer = useCallback((updatedFreezer) => {
        setFreezers(prev => 
          prev.map(f => f.id === updatedFreezer.id ? updatedFreezer : f)
        )
      })

      console.log("Freezers data:", freezers);

  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={1}
      loop={false}
      navigation
      style={{ width: '100%', height: '100%' }}
    >
      {freezers.map((fr) => (
        <SwiperSlide key={fr.id}>
          <Freezer freezerData={fr} setFreezerData={handleUpdateOneFreezer}/>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
