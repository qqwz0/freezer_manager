import { React, useEffect, useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { getUserFreezerData, deleteFreezer, createFreezer } from '../firebase/firestoreService'
import { useAuth } from '../contexts/AuthContext'
import AddButton from './AddButton'
import AddModal from './Modal'

import 'swiper/css';
import 'swiper/css/navigation';

import Freezer from './Freezer';

SwiperCore.use([Navigation]);

export default function FreezerCarousel() {
    const [freezers, setFreezers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
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
      }, [user]);

      const handleUpdateOneFreezer = useCallback((updatedFreezer) => {
        setFreezers(prev => 
          prev.map(f => f.id === updatedFreezer.id ? updatedFreezer : f)
        )
      })

      const handleAddFreezer = useCallback(async (name) => {
        if (!name) return;

        try {
          const newId = await createFreezer(user.uid, name);
          const newFreezer = {
            id: newId,
            name: name.trim(),
            shelves: [],
          }
          setFreezers(prev => [...prev, newFreezer]);
        } catch (e) {
          console.error(e);
          alert("Error creating freezer. Please try again.");
        }
      }, [user])

      const handleDeleteFreezer = useCallback((freezerId) => {
        setFreezers(prev => prev.filter(f => f.id !== freezerId))
      }, []);

  return (
    <>
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        loop={false}
        navigation
        style={{ width: '100%', height: '100%' }}
        observer={true}
        observeParents={true}
        className='w-full h-full flex justify-center items-center'
      >
        {freezers.map((fr) => (
          <SwiperSlide key={fr.id}>
            <Freezer freezerData={fr} 
            setFreezerData={handleUpdateOneFreezer}
            onDeleteFreezer={handleDeleteFreezer}
            onEditFreezer={handleUpdateOneFreezer}
            />
          </SwiperSlide>
        ))}
          <SwiperSlide>
            <AddButton label="Freezer" onClick={() => setIsModalOpen(true)} action={"Add"} />
          </SwiperSlide>
      </Swiper>

      <AddModal 
        show={isModalOpen} 
        onClose={() => {setIsModalOpen(false)}} 
        onAdd={(name) => {handleAddFreezer(name); setIsModalOpen(false)}}
        title="Freezer" 
        required={true}
      />
    </>
  );
}
