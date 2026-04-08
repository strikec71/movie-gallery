import { renderHook, act } from '@testing-library/react';
import { useFetch } from '../useFetch';
import { describe, it, expect, vi } from 'vitest';

// Подменяем реальный fetch на моковый (чтобы не делать реальные запросы в сеть во время тестов)
global.fetch = vi.fn();

describe('Тестирование хука useFetch', () => {
  it('Должен успешно загружать данные', async () => {
    const mockData = { results: [{ id: 1, title: 'Test Movie' }] };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useFetch());
    
    let data;
    await act(async () => {
      data = await result.current.request('https://api.test.com/movies');
    });

    expect(data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('Должен обрабатывать ошибку сети', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => useFetch());
    
    await act(async () => {
      try {
        await result.current.request('https://api.test.com/error');
      } catch (e) {
      }
    });

    expect(result.current.error).toBe('Network Error');
    expect(result.current.loading).toBe(false);
  });
});