import React, { useEffect, useState, useCallback } from 'react';
import { Swiper, SwiperSlide }           from 'swiper/react';
import { Navigation }         from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { getUserFreezerData, deleteFreezer, createFreezer }
  from 'services/firestoreService';
import { useAuth } from 'contexts/AuthContext';

import { ActionButton } from 'components/common/Button';
import { Modal } from 'components/common/Modal';
import { Freezer } from 'components/feautures/Freezers';

import 'swiper/css';
import 'swiper/css/navigation';

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

      const handleUpdateShelf = useCallback(
        (freezerId, shelfId, newName) => {
          setFreezers(prevFreezers =>
            prevFreezers.map(freezer =>
              freezer.id === freezerId
                ? {
                    ...freezer,
                    shelves: freezer.shelves.map(s =>
                      s.id === shelfId
                        ? { ...s, name: newName }
                        : s
                    )
                  }
                : freezer
            )
          );
        },
        [setFreezers]
      );

  return (
    <>
      <Swiper
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        loop={false}
        navigation
        style={{ width: '100%', height: '100%' }}
        observer={true}
        observeParents={true}
        observeSlideChildren={true}
        className='w-full h-full flex justify-center items-center'
      >
        {freezers.map((fr) => (
          <SwiperSlide key={fr.id}>
            <Freezer freezerData={fr} 
            setFreezerData={handleUpdateOneFreezer}
            onDeleteFreezer={handleDeleteFreezer}
            onEditFreezer={handleUpdateOneFreezer}
            onEditShelf={handleUpdateShelf}
            />
          </SwiperSlide>
        ))}
          <SwiperSlide>
            <ActionButton label="Freezer" onClick={() => setIsModalOpen(true)} action="add" className="w-1/5"/>
          </SwiperSlide>
      </Swiper>

      <Modal 
        show={isModalOpen} 
        onClose={() => {setIsModalOpen(false)}} 
        onAdd={({ name }) => {handleAddFreezer(name); setIsModalOpen(false)}}
        fields={[{ key: 'name', label: 'Freezer Name', type: 'text', placeholder: 'Enter freezer name', required: true }]}
      />
    </>
  );
}
