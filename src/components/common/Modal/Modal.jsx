import React, { useState } from 'react';
import { ActionButton } from 'components/common/Button'
import { FormInput }                  from 'components/common/Form';
import { BaseModal }      from 'components/common/Modal';

function AddModal({
  show,
  onClose,
  onAdd,
  title,
  fields = [],     // default to empty array
}) {
  const [name, setName] = useState("");
  const [extraValues, setExtraValues] = useState({});

  const handleChange = (key, value) => {
    setExtraValues(prev => ({ ...prev, [key]: value }));
  };
 
  const handleAddClick = () => {
    if (!name) return;
    // pass both name and other fields to parent
    onAdd({ name, ...extraValues });

    setName("");
    setExtraValues({});
    onClose();
  };

  
  return (
    <BaseModal
      show={show}
      onClose={onClose}
      header={`Add ${title}`}
      footer={
        <ActionButton onClick={handleAddClick} action="submit">
          Add
        </ActionButton>
      }
    >
      {fields.map(f => (
        <div key={f.key} className="mb-4">
          <label className="block mb-1 font-medium">{f.label}</label>

          {f.type === "file" ? (
            <FormInput 
            type="file"
            accept="image/*"
            onChange={e => {handleChange(f.key, e.target.files[0]); console.log("He;", e.target.files[0])}}
            />
          ) : (
          <FormInput
            key={f.key}
            type={f.type}
            placeholder={f.placeholder}
            required={f.required}
            value={f.key === "name" ? name : extraValues[f.key] || ""}
            onChange={e =>
            f.key === "name"
              ? setName(e.target.value)
              : handleChange(f.key, e.target.value)
          }
          />
        )}
        </div>
      ))}
    </BaseModal>
  );
}


export default AddModal