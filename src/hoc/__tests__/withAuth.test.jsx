import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import withAuth from '../withAuth';

const SecretPage = () => <div>Secret content</div>;
const ProtectedSecretPage = withAuth(SecretPage);

describe('withAuth', () => {
  afterEach(() => {
    localStorage.removeItem('movie-gallery-auth');
  });

  it('renders wrapped component when user is authenticated', () => {
    localStorage.setItem('movie-gallery-auth', 'true');
    render(<ProtectedSecretPage />);
    expect(screen.getByText('Secret content')).toBeInTheDocument();
  });

  it('renders access denied message when user is not authenticated', () => {
    localStorage.setItem('movie-gallery-auth', 'false');
    render(<ProtectedSecretPage />);
    expect(screen.getByText('Доступ ограничен')).toBeInTheDocument();
  });
});
