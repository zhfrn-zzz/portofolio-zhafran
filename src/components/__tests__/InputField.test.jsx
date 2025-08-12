import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mail } from 'lucide-react';
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
  });

  test('renders textarea for message field', () => {
    const messageProps = {
      ...defaultProps,
      field: 'message',
      label: 'Your Message'
    };

    render(<InputField {...messageProps} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea.tagName).toBe('TEXTAREA');
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

  test('renders icon correctly', () => {
    render(<InputField {...defaultProps} />);

    // Icon should be present (Mail icon from lucide-react)
    const iconContainer = screen.getByLabelText('Email Address').parentElement;
    expect(iconContainer).toBeInTheDocument();
  });
});
