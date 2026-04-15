import { renderHook, act } from '@testing-library/react';
import { useForm } from '../useForm';
import { describe, it, expect } from 'vitest';

describe('Тестирование хука useForm', () => {
  it('Должен инициализировать начальные значения', () => {
    const { result } = renderHook(() => useForm({ title: 'Матрица' }));
    expect(result.current.values.title).toBe('Матрица');
  });

  it('Должен изменять значения при handleChange', () => {
    const { result } = renderHook(() => useForm({ title: '' }));
    
    act(() => {
      result.current.handleChange({ target: { name: 'title', value: 'Интерстеллар', type: 'text' } });
    });

    expect(result.current.values.title).toBe('Интерстеллар');
  });

  it('Должен сбрасывать форму', () => {
    const { result } = renderHook(() => useForm({ title: 'Начало' }));
    
    act(() => {
      result.current.handleChange({ target: { name: 'title', value: 'Новый', type: 'text' } });
    });
    
    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values.title).toBe('Начало');
  });
});