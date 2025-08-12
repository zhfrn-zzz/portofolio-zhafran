import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Modal from '../Modal';

// Simple Modal tests
describe('Modal Component', () => {
  const mockProject = {
    title: 'Test Project',
    description: 'Test description',
    demoUrl: 'https://example.com'
  };

  test('renders when open', () => {
    renderWithProviders(
      <Modal isOpen={true} onClose={jest.fn()} project={mockProject} />
    );

    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    renderWithProviders(
      <Modal isOpen={false} onClose={jest.fn()} project={mockProject} />
    );

    expect(screen.queryByText('Test Project')).not.toBeInTheDocument();
  });

  test('renders close button', () => {
    renderWithProviders(
      <Modal isOpen={true} onClose={jest.fn()} project={mockProject} />
    );

    // Look for any button that could be a close button
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('handles missing project', () => {
    renderWithProviders(
      <Modal isOpen={true} onClose={jest.fn()} project={null} />
    );

    // Should not crash
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });
});
