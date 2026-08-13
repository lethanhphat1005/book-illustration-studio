/** @vitest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from '../src/features/auth/LoginForm';

vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useNavigate: () => vi.fn(),
}));

describe('Frontend: Login Form UI Flow', () => {
  it('should successfully render the login form and accept user input', () => {
    // Step 1: Mount the LoginForm component into the virtual JSDOM environment
    render(<LoginForm />);

    // Step 2: Locate the email input field using its specific placeholder text
    const emailInput = screen.getByPlaceholderText('hello@example.com');
    
    // Step 3: Simulate a user typing an email string into the input field
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // Step 4: Assert that the input element successfully captures and reflects the typed value
    expect((emailInput as HTMLInputElement).value).toBe('test@example.com');
  });
});