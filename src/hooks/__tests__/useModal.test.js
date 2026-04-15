import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useModal } from '../useModal';

describe('useModal', () => {
  it('opens modal with payload data', () => {
    const { result } = renderHook(() => useModal());
    const payload = { id: 10, title: 'Movie' };

    act(() => {
      result.current.open(payload);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.modalData).toEqual(payload);
  });

  it('closes modal and clears payload data', () => {
    const { result } = renderHook(() => useModal(true));

    act(() => {
      result.current.open({ id: 1 });
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.modalData).toBe(null);
  });
});
