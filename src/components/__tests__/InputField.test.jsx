import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mail, User, MessageSquare } from 'lucide-react';
import InputField from '../InputField';

describe('InputField', () => {
  const defaultProps = {
    field: 'email',
    label: 'Email Address',
    icon: Mail,
    formData: { email: '' },
    handleChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input field correctly', () => {
    render(<InputField {...defaultProps} />);

    const input = screen.getByLabelText('Email Address');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('name', 'email');
  });

  test('renders textarea for message field', () => {
    const messageProps = {
      ...defaultProps,
      field: 'message',
      label: 'Your Message',
      icon: MessageSquare
    };

    render(<InputField {...messageProps} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('name', 'message');
  });

  test('calls handleChange when input value changes', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    
    render(<InputField {...defaultProps} handleChange={handleChange} />);

    const input = screen.getByLabelText('Email Address');
    await user.type(input, 'test@example.com');

    expect(handleChange).toHaveBeenCalled();
  });

  test('displays current value from formData', () => {
    const propsWithValue = {
      ...defaultProps,
      formData: { email: 'existing@example.com' }
    };

    render(<InputField {...propsWithValue} />);

    const input = screen.getByDisplayValue('existing@example.com');
    expect(input).toBeInTheDocument();
  });

  test('applies focus styles when input is focused', async () => {
    const user = userEvent.setup();
    
    render(<InputField {...defaultProps} />);

    const input = screen.getByLabelText('Email Address');
    await user.click(input);

    expect(input).toHaveFocus();
  });

  test('renders different input types based on field', () => {
    const nameProps = {
      ...defaultProps,
      field: 'name',
      label: 'Full Name',
      icon: User
    };

    render(<InputField {...nameProps} />);

    const input = screen.getByLabelText('Full Name');
    expect(input).toHaveAttribute('type', 'text');
  });

  test('handles empty formData gracefully', () => {
    const emptyProps = {
      ...defaultProps,
      formData: {}
    };

    render(<InputField {...emptyProps} />);

    const input = screen.getByLabelText('Email Address');
    expect(input).toHaveValue('');
  });

  test('label moves on focus and blur', async () => {
    const user = userEvent.setup();
    render(<InputField {...defaultProps} />);

    const input = screen.getByLabelText('Email Address');
    
    // Focus should trigger label animation
    await user.click(input);
    expect(input).toHaveFocus();

    // Blur should return label if no value
    await user.tab();
    expect(input).not.toHaveFocus();
  });
});
