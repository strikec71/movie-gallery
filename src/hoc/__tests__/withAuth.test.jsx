import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import withAuth from '../withAuth';
import { AuthContext } from '../../context/AuthContext';

const SecretPage = () => <div>Secret content</div>;
const ProtectedSecretPage = withAuth(SecretPage);

const renderWithAuth = (authValue) =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={authValue}>
        <ProtectedSecretPage />
      </AuthContext.Provider>
    </MemoryRouter>
  );

const baseAuth = {
  isAdmin: false,
  setIsAuthModalOpen: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  signInWithGoogle: vi.fn(),
  isAuthModalOpen: false,
};

describe('withAuth', () => {
  it('renders wrapped component when user is authenticated', () => {
    renderWithAuth({
      ...baseAuth,
      user: { id: 'user-1' },
      loading: false,
    });
    expect(screen.getByText('Secret content')).toBeInTheDocument();
  });

  it('does not render secret content when user is not authenticated', () => {
    renderWithAuth({
      ...baseAuth,
      user: null,
      loading: false,
    });
    expect(screen.queryByText('Secret content')).not.toBeInTheDocument();
  });
});
