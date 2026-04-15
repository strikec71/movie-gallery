import { useState, useCallback } from 'react';

export const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (e) {
      setError(e.message);
      setLoading(false);
      throw e;
    }
  }, []);

  const execute = useCallback(async (requestFn) => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestFn();
      setLoading(false);
      return data;
    } catch (e) {
      setError(e.message);
      setLoading(false);
      throw e;
    }
  }, []);

  return { loading, error, request, execute };
};