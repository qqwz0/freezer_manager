import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { useState } from 'react'
import { FormInput } from './FormInput';

function AddModal({ openModal, setOpenModal, handleAddition, title, required} ) {
    const [thingName, setThingName] = useState("");

    const handleAddClick = () => {
        handleAddition(thingName);
        setOpenModal(false);
    }

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader>Add {title}</ModalHeader>
        <ModalBody>
            <form className="flex flex-col gap-4">
                <FormInput
                    type="text"
                    placeholder={`${title} Name`}
                    label={`${title} Name`}
                    required={required}
                    onChange={(e) => setThingName(e.target.value)}
                />
            </form>
        </ModalBody>
        <ModalFooter>
            <Button onClick={handleAddClick}>Add</Button>
        </ModalFooter>
    </Modal>
  )
}

export default AddModal