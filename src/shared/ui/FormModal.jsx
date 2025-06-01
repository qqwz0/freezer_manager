import React, { useState, useEffect } from 'react'
import { BaseModal, ActionButton, FormInput } from 'shared/ui'

function FormModal(
    { show,
      onClose,
      onSubmit,
      mode,
      title,
      fields = [],  // [{ key, label, type, placeholder, required }]
      initialData = {},
    }
) {
    const [values, setValues] = useState({});
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const hasInitialized = React.useRef(false);

    useEffect(() => {
        if (!show) {
            hasInitialized.current = false;
            return;
        }
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        if (mode === 'edit') {
            const initial = {};
            let previewUrl = null;

            fields.forEach(f => {
                if (f.type === 'file') {
                    const data = initialData[f.key];
                    if (data instanceof File) {
                        initial[f.key] = data;
                        previewUrl = URL.createObjectURL(data);
                    } else if (typeof data === 'string' && data) {
                        initial[f.key] = null;
                        previewUrl = data;
                    } else {
                        initial[f.key] = null;
                    }
                } else {
                    initial[f.key] = initialData[f.key] ?? (f.required ? '' : null);
                }
            });

            setValues(initial);
            setPreview(previewUrl);
        } else if (mode === 'add') {
            const initial = fields.reduce((acc, f) => {
                acc[f.key] = '';
                return acc;
            }, {});
            setValues(initial);
            setPreview(null);
        }

        setErrors({});
    }, [mode, fields, initialData, show]);

    const handleChange = (key, value) => {
        setValues(prev => ({ ...prev, [key]: value }));
    };

    const validate = () => {
      const errs = {}
      if (mode !== 'delete') {
        fields.forEach(f => {
          const val = values[f.key]
          if (f.required && f.key !== 'shelfId' && (val === '' || val == null)) {
            errs[f.key] = `${f.label || f.key} is required`
          }
          if (f.type === 'number' && val !== '' && val != null) {
            const isNumeric = !isNaN(val) && /^-?\d+(\.\d+)?$/.test(val.toString());
            if (!isNumeric) {
              errs[f.key] = `${f.label || f.key} must be a valid number`;
            }
          }
        });
      }
      return errs
    }

    const handleConfirm = () => {
        const newErrors = validate()
        if (Object.keys(newErrors).length) {
          setErrors(newErrors)
          return
        }

        if (mode === 'delete') {
            onSubmit();
        } else if (mode === 'edit') {
            console.log('payload', { ...values, id: initialData.id })
            const payload = { ...values, id: initialData.id };
            if (values.photoUrl == null) delete payload.photoUrl;
            onSubmit(payload);
        } else {
            onSubmit(values);
        }
        onClose();
    };


    const isDel = mode === 'delete';
    const headerText = isDel
        ? `Delete ${title}`
        : `${mode === 'edit' ? 'Edit' : 'Add'} ${title}`;

    return (
        <BaseModal show={show} onClose={onClose} header={headerText}
          footer={
            <ActionButton onClick={handleConfirm} action="submit">
              {isDel ? 'Delete' : mode === 'edit' ? 'Save' : 'Add'}
            </ActionButton>
          }
        >
          {isDel ? (
            <p className='text-center'>
              Are you sure you want to delete this {title}? This action cannot be undone.
            </p>
          ) : (
            fields.map(f => {
              const error = errors[f.key]
              return(
              <div key={f.key} className="mb-4">
                {f.type === 'file' && (
                  <>
                    <FormInput
                      id={f.key}
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        handleChange(f.key, file);
                        setPreview(URL.createObjectURL(file));
                      }}
                      label={f.label}
                      error={error}
                    />
                    {preview && (
                      <img
                        src={preview}
                        alt="Preview"
                        className="mt-2 h-32 w-full object-cover rounded-lg"
                      />
                    )}
                  </>
                ) }

                {f.type === 'select' && (() => {
                  const opts = f.options || [];
                  const emptyOptionLabel = `-- No ${f.label || f.key} --`;
                  const emptyOption = { id: '', name: emptyOptionLabel };

                  const selectedId = f.value?.id ?? values[f.key] ?? '';
                  const currentOpt = opts.find(o => o.id === selectedId) || null;
                  const others = opts.filter(o => o.id !== (currentOpt?.id));

                  let finalOptions = [];

                  if (mode === 'add') {
                    // Add mode: always show empty option
                    if (!selectedId) {
                      // Nothing selected: empty first
                      finalOptions = [
                        emptyOption,
                        ...others,
                      ];
                    } else {
                      // Something selected: selected first, others, then empty last
                      finalOptions = [
                        currentOpt,
                        ...others,
                        emptyOption,
                      ];
                    }
                  } else {
                    // Edit mode: always show empty option
                    if (!selectedId) {
                      // Nothing selected: empty first
                      finalOptions = [
                        emptyOption,
                        ...others,
                      ];
                    } else {
                      // Something selected: selected first, others, then empty last
                      finalOptions = [
                        currentOpt,
                        ...others,
                        emptyOption,
                      ];
                    }
                  }
                  return (
                    <FormInput
                      id={f.key}
                      type="select"
                      value={selectedId}
                      onChange={e => handleChange(f.key, e.target.value)}
                      label={f.label}
                      error={error}
                    >
                      {finalOptions.map(opt =>
                        opt ? (
                          <option key={opt.id} value={opt.id}>
                            {opt.name}
                          </option>
                        ) : null
                      )}
                    </FormInput>
                  );
                })()}

              
              {f.type === 'date' && (() => {
                // Get the raw value from form state
                const rawValue = values[f.key] || null;
                
                // Convert to Date object for Flowbite datepicker
                let dateValue = null;
                if (rawValue) {
                  if (typeof rawValue === 'string') {
                    // Parse DMY format (DD.MM.YYYY or DD/MM/YYYY)
                    const parts = rawValue.includes('.') ? rawValue.split('.') : rawValue.split('/');
                    if (parts.length === 3) {
                      const [day, month, year] = parts.map(Number);
                      // Create date in local timezone to avoid timezone shifts
                      dateValue = new Date(year, month - 1, day);
                    } else {
                      // Fallback to standard parsing for other formats
                      dateValue = new Date(rawValue);
                    }
                  } else if (rawValue instanceof Date) {
                    // If it's already a Date object, use it
                    dateValue = rawValue;
                  }
                  
                  // Ensure the date is valid
                  if (dateValue && isNaN(dateValue.getTime())) {
                    dateValue = null;
                  }
                }
                
                // Determine minimum date based on field type and other field values
                let minDate;
                if (f.key === 'freezingDate') {
                  // Freezing date minimum is today
                  minDate = new Date();
                } else if (f.key === 'expirationDate') {
                  // Expiration date minimum is freezing date (if set) or today
                  const freezingDateValue = values.freezingDate;
                  if (freezingDateValue) {
                    if (typeof freezingDateValue === 'string') {
                      const parts = freezingDateValue.includes('.') ? freezingDateValue.split('.') : freezingDateValue.split('/');
                      if (parts.length === 3) {
                        const [day, month, year] = parts.map(Number);
                        minDate = new Date(year, month - 1, day);
                      } else {
                        minDate = new Date(freezingDateValue);
                      }
                    } else if (freezingDateValue instanceof Date) {
                      minDate = freezingDateValue;
                    } else {
                      minDate = new Date();
                    }
                  } else {
                    minDate = new Date();
                  }
                } else {
                  // Default minimum date is today
                  minDate = new Date();
                }
                
                return (
                  <FormInput
                    id={f.key}
                    type={f.type}
                    required={f.required}
                    value={dateValue}
                    onChange={e => handleChange(f.key, e.target.value)}
                    label={f.label}
                    error={error}
                    minDate={minDate}
                  />
                );
              })()}

                  

                {f.type !== 'file' && f.type !== 'select' && f.type !== 'date' &&(
                  <FormInput
                    id={f.key}
                    type={f.type}
                    placeholder={f.placeholder}
                    required={f.required}
                    value={values[f.key] || ''}
                    onChange={e => handleChange(f.key, e.target.value)}
                    label={f.label}
                    error={error}
                    // minDate={minDate}
                  />
                )}
              </div>
            )})
          )}
        </BaseModal>
    )
}

export default FormModal;
