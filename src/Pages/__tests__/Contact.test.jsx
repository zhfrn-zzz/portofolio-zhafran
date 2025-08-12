import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../utils/test-utils';
import Contact from '../Contact';

// Mock fetch for form submission
global.fetch = jest.fn();

describe('Contact Page', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders page title', () => {
    renderWithProviders(<Contact />);

    expect(screen.getByText(/Contact|Kontak/i)).toBeInTheDocument();
  });

  test('renders contact form', () => {
    renderWithProviders(<Contact />);

    // Should have form fields
    expect(screen.getByLabelText(/name|nama/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message|pesan/i)).toBeInTheDocument();
  });

  test('renders submit button', () => {
    renderWithProviders(<Contact />);

    const submitButton = screen.getByRole('button', { name: /send|kirim/i });
    expect(submitButton).toBeInTheDocument();
  });

  test('displays contact information', () => {
    renderWithProviders(<Contact />);

    // Should show email and other contact details
    expect(screen.getByText(/email/i)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Contact />);

    const submitButton = screen.getByRole('button', { name: /send|kirim/i });
    
    // Try to submit empty form
    await user.click(submitButton);

    // Should show validation errors
    await waitFor(() => {
      const errorMessages = screen.getAllByText(/required|wajib|harus/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  test('validates email format', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Contact />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send|kirim/i });

    // Enter invalid email
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    // Should show email validation error
    await waitFor(() => {
      const emailError = screen.getByText(/valid email|email yang valid/i);
      expect(emailError).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    renderWithProviders(<Contact />);

    // Fill form with valid data
    await user.type(screen.getByLabelText(/name|nama/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/message|pesan/i), 'Test message');

    const submitButton = screen.getByRole('button', { name: /send|kirim/i });
    await user.click(submitButton);

    // Should show success message
    await waitFor(() => {
      const successMessage = screen.getByText(/success|berhasil|terkirim/i);
      expect(successMessage).toBeInTheDocument();
    });
  });

  test('handles form submission error', async () => {
    const user = userEvent.setup();
    fetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<Contact />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/name|nama/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/message|pesan/i), 'Test message');

    const submitButton = screen.getByRole('button', { name: /send|kirim/i });
    await user.click(submitButton);

    // Should show error message
    await waitFor(() => {
      const errorMessage = screen.getByText(/error|gagal|failed/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test('shows loading state during submission', async () => {
    const user = userEvent.setup();
    fetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 1000)));

    renderWithProviders(<Contact />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/name|nama/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/message|pesan/i), 'Test message');

    const submitButton = screen.getByRole('button', { name: /send|kirim/i });
    await user.click(submitButton);

    // Should show loading state
    expect(screen.getByText(/sending|mengirim|loading/i)).toBeInTheDocument();
  });

  test('renders social media links', () => {
    renderWithProviders(<Contact />);

    // Should have social media links
    const socialLinks = screen.getAllByRole('link');
    expect(socialLinks.length).toBeGreaterThan(0);
  });

  test('clears form after successful submission', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    renderWithProviders(<Contact />);

    const nameInput = screen.getByLabelText(/name|nama/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message|pesan/i);

    // Fill form
    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(messageInput, 'Test message');

    const submitButton = screen.getByRole('button', { name: /send|kirim/i });
    await user.click(submitButton);

    // Wait for form to clear
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(messageInput).toHaveValue('');
    });
  });

  test('keyboard navigation works', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Contact />);

    // Tab through form elements
    await user.tab();
    expect(document.activeElement).toBe(screen.getByLabelText(/name|nama/i));

    await user.tab();
    expect(document.activeElement).toBe(screen.getByLabelText(/email/i));

    await user.tab();
    expect(document.activeElement).toBe(screen.getByLabelText(/message|pesan/i));
  });

  test('page loads without crashing', () => {
    renderWithProviders(<Contact />);

    // Basic smoke test
    expect(screen.getByText(/Contact|Kontak/i)).toBeInTheDocument();
  });
});
