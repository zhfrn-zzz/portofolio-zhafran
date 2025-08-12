import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import CardProject from '../CardProject';

// Mock window.alert
global.alert = jest.fn();

describe('CardProject', () => {
  const defaultProps = {
    Img: '/test-image.jpg',
    Title: 'Test Project',
    Description: 'Test project description',
    Link: 'https://example.com',
    id: 1
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders project card with correct information', () => {
    renderWithProviders(<CardProject {...defaultProps} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Test project description')).toBeInTheDocument();
  });

  test('renders image with correct src and alt', () => {
    renderWithProviders(<CardProject {...defaultProps} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Project');
  });

  test('live demo button works when link is provided', () => {
    renderWithProviders(<CardProject {...defaultProps} />);

    const liveDemoButton = screen.getByText('Live Demo');
    expect(liveDemoButton).toBeInTheDocument();
    expect(liveDemoButton.closest('a')).toHaveAttribute('href', 'https://example.com');
  });

  test('shows alert when live demo clicked but no link provided', () => {
    const propsWithoutLink = { ...defaultProps, Link: '' };
    renderWithProviders(<CardProject {...propsWithoutLink} />);

    // When link is empty, it should show "Live demo not available" text instead of button
    expect(screen.getByText('Live demo not available')).toBeInTheDocument();
  });

  test('detail button works when id is provided', () => {
    renderWithProviders(<CardProject {...defaultProps} />);

    const detailButton = screen.getByText('Details');
    expect(detailButton).toBeInTheDocument();
    expect(detailButton.closest('a')).toHaveAttribute('href', '/project/1');
  });

  test('shows message when detail clicked but no id provided', () => {
    const propsWithoutId = { ...defaultProps, id: null };
    renderWithProviders(<CardProject {...propsWithoutId} />);

    // When id is null, it should show "Project details not available" text instead of button
    expect(screen.getByText('Project details not available')).toBeInTheDocument();
  });

  test('handles missing props gracefully', () => {
    const minimalProps = {
      Img: '/test.jpg',
      Title: 'Test',
      Description: 'Description'
    };

    renderWithProviders(<CardProject {...minimalProps} />);

    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
