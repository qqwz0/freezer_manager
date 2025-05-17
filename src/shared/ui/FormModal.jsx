import React, { useState, useEffect } from 'react'
import { BaseModal, ActionButton, FormInput } from 'shared/ui'

function FormModal(
    {show,
    onClose,
    onSubmit,
    mode,
    title,
    fields = [],  // [{ key, label, type, placeholder, required }]
    initialData = {},}
) {
    const [values, setValues] = useState({});

    const hasInitialized = React.useRef(false)

    useEffect(() => {
        if (!show) {
            hasInitialized.current = false
            return;
        }; 
        if (hasInitialized.current) {
            return;
        };
        hasInitialized.current = true;

        if (mode === 'edit') {
            const initial = {};
            fields.forEach(f => { 
                if (f.type === 'file') {
                    initial[f.key] = null;
                } else {
                    initial[f.key] = initialData[f.key] ?? (f.required ? '' : null);
                }
            });
            setValues(initial);
        } else if (mode === 'add') {
            setValues(fields.reduce((acc, f) => {
                acc[f.key] = '';
                return acc;
            }, {}));
        }
      }, [mode, fields, initialData, show]);

    const handleChange = (key, value) => {
        setValues(prev => ({ ...prev, [key]: value }));
    };

    const handleConfirm = () => {
        if (mode === 'delete') {
            onSubmit();
        } else if (mode === 'edit')  {
            onSubmit({ ...values, id: initialData.id });
        }
        else {
            onSubmit(values);
        }
        onClose();
    }

    const isDel = mode === 'delete';
    const headerText = isDel ? `Delete ${title}` : `${mode === 'edit' ? 'Edit' : 'Add'} ${title}`;

  return (
    <BaseModal show={show} onClose={onClose} header={headerText}
    footer={
        <ActionButton onClick={handleConfirm} action="submit">
            { isDel ? 'Delete' : mode === 'edit' ? 'Save' : 'Add'}
        </ActionButton>
    }>
        { isDel 
            ?  <p className='text-center'>Are you sure you want to delete this {title}? This action cannot be undone.</p>
            : fields.map(f => (
                <div key={f.key} className="mb-4">
                    {f.type === "file" ? (
                        <FormInput 
                            type="file"
                            accept="image/*"
                            onChange={e => {handleChange(f.key, e.target.files[0]); console.log("He;", e.target.files[0])}}
                        />
                    ) : (
                        <FormInput
                            type={f.type}
                            placeholder={f.placeholder}
                            required={f.required}
                            value={values[f.key] || ''}
                            onChange={e => handleChange(f.key, e.target.value)}
                        />
                    )}
                </div>
            ))
            }
    </BaseModal>
  )
}

export default FormModal;