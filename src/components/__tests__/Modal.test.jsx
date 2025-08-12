import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProjectCardModal from '../Modal';

describe('ProjectCardModal', () => {
  const defaultProps = {
    title: 'Test Project',
    description: 'This is a test project description',
    link: 'https://example.com'
  };

  test('renders modal trigger button', () => {
    render(<ProjectCardModal {...defaultProps} />);

    const triggerButton = screen.getByText('Detail');
    expect(triggerButton).toBeInTheDocument();
  });

  test('opens modal when trigger button is clicked', async () => {
    const user = userEvent.setup();
    render(<ProjectCardModal {...defaultProps} />);

    const triggerButton = screen.getByText('Detail');
    await user.click(triggerButton);

    // Modal should be visible
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('This is a test project description')).toBeInTheDocument();
  });

  test('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<ProjectCardModal {...defaultProps} />);

    // Open modal
    const triggerButton = screen.getByText('Detail');
    await user.click(triggerButton);

    // Close modal via close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    // Modal content should not be visible
    expect(screen.queryByText('This is a test project description')).not.toBeInTheDocument();
  });

  test('closes modal when clicking outside', async () => {
    const user = userEvent.setup();
    render(<ProjectCardModal {...defaultProps} />);

    // Open modal
    const triggerButton = screen.getByText('Detail');
    await user.click(triggerButton);

    // Click on backdrop
    const backdrop = screen.getByTestId('modal-backdrop');
    await user.click(backdrop);

    // Modal should close
    expect(screen.queryByText('This is a test project description')).not.toBeInTheDocument();
  });

  test('renders external link correctly', async () => {
    const user = userEvent.setup();
    render(<ProjectCardModal {...defaultProps} />);

    // Open modal
    const triggerButton = screen.getByText('Detail');
    await user.click(triggerButton);

    // Check external link
    const externalLink = screen.getByRole('link');
    expect(externalLink).toHaveAttribute('href', 'https://example.com');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('handles missing link gracefully', async () => {
    const user = userEvent.setup();
    const propsWithoutLink = {
      ...defaultProps,
      link: ''
    };

    render(<ProjectCardModal {...propsWithoutLink} />);

    // Open modal
    const triggerButton = screen.getByText('Detail');
    await user.click(triggerButton);

    // Should still render without link
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });
});
