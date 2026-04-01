import { useState, useCallback } from 'react';

export const useForm = (initialValues, validateFunc = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({ ...prev, [name]: finalValue }));
    
    if (validateFunc && touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateFunc(name, finalValue) }));
    }
  }, [touched, validateFunc]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    if (validateFunc) {
      setErrors(prev => ({ ...prev, [name]: validateFunc(name, value) }));
    }
  }, [validateFunc]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return { values, setValues, errors, touched, setTouched, handleChange, handleBlur, resetForm };
};