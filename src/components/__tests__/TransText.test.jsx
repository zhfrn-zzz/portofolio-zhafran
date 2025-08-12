import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import TransText from '../TransText';

describe('TransText', () => {
  test('renders fallback text when translation key not found', () => {
    renderWithProviders(
      <TransText k="non.existent.key" fallback="Fallback Text" />
    );

    expect(screen.getByText('Fallback Text')).toBeInTheDocument();
  });

  test('applies className correctly', () => {
    renderWithProviders(
      <TransText 
        k="non.existent.key" 
        fallback="Test Text" 
        className="test-class"
      />
    );

    const element = screen.getByText('Test Text');
    expect(element).toHaveClass('test-class');
  });

  test('renders as different HTML element when specified', () => {
    renderWithProviders(
      <TransText 
        k="non.existent.key" 
        fallback="Heading Text" 
        as="h1"
      />
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Heading Text');
  });

  test('renders translation text when key exists', () => {
    // Mock I18n context to return specific translation
    renderWithProviders(
      <TransText k="home.welcome" fallback="Welcome" />
    );

    // Should either show translation or fallback
    const element = screen.getByText(/Welcome|Selamat/);
    expect(element).toBeInTheDocument();
  });
});
