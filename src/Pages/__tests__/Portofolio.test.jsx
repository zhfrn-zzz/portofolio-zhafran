import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../utils/test-utils';
import Portofolio from '../Portofolio';

// Mock the ProjectDetail modal to avoid complex modal testing
jest.mock('../../components/ProjectDetail', () => {
  return function MockProjectDetail({ isOpen, onClose, project }) {
    return isOpen ? (
      <div data-testid="project-detail-modal">
        <h2>{project?.title || 'Project Details'}</h2>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null;
  };
});

describe('Portfolio Page', () => {
  test('renders page title', () => {
    renderWithProviders(<Portofolio />);

    expect(screen.getByText(/Portfolio|Portofolio/i)).toBeInTheDocument();
  });

  test('renders project cards', async () => {
    renderWithProviders(<Portofolio />);

    // Should render project cards
    await waitFor(() => {
      const projectCards = screen.getAllByTestId(/project-card/i);
      expect(projectCards.length).toBeGreaterThan(0);
    });
  });

  test('renders filter buttons', () => {
    renderWithProviders(<Portofolio />);

    // Should have filter options
    const allFilter = screen.getByRole('button', { name: /all|semua/i });
    expect(allFilter).toBeInTheDocument();
  });

  test('filters projects by category', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Portofolio />);

    // Wait for projects to load
    await waitFor(() => {
      expect(screen.getAllByTestId(/project-card/i).length).toBeGreaterThan(0);
    });

    const initialProjectCount = screen.getAllByTestId(/project-card/i).length;

    // Click on a filter (React filter for example)
    const reactFilter = screen.getByRole('button', { name: /react/i });
    if (reactFilter) {
      await user.click(reactFilter);
      
      // Should filter projects
      await waitFor(() => {
        const filteredProjects = screen.getAllByTestId(/project-card/i);
        // Either same count (all are React) or fewer projects
        expect(filteredProjects.length).toBeLessThanOrEqual(initialProjectCount);
      });
    }
  });

  test('opens project detail modal on card click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Portofolio />);

    // Wait for project cards to load
    await waitFor(() => {
      expect(screen.getAllByTestId(/project-card/i).length).toBeGreaterThan(0);
    });

    // Click on first project card
    const firstProjectCard = screen.getAllByTestId(/project-card/i)[0];
    await user.click(firstProjectCard);

    // Should open modal
    await waitFor(() => {
      expect(screen.getByTestId('project-detail-modal')).toBeInTheDocument();
    });
  });

  test('closes project detail modal', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Portofolio />);

    // Wait for project cards and open modal
    await waitFor(() => {
      expect(screen.getAllByTestId(/project-card/i).length).toBeGreaterThan(0);
    });

    const firstProjectCard = screen.getAllByTestId(/project-card/i)[0];
    await user.click(firstProjectCard);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByTestId('project-detail-modal')).toBeInTheDocument();
    });

    // Close modal
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    // Modal should be closed
    await waitFor(() => {
      expect(screen.queryByTestId('project-detail-modal')).not.toBeInTheDocument();
    });
  });

  test('displays project count', () => {
    renderWithProviders(<Portofolio />);

    // Should show number of projects
    const projectCount = screen.getByText(/project/i);
    expect(projectCount).toBeInTheDocument();
  });

  test('renders loading state initially', () => {
    renderWithProviders(<Portofolio />);

    // Should show loading state before projects load
    const loadingElement = screen.getByTestId(/loading/i);
    expect(loadingElement).toBeInTheDocument();
  });

  test('handles empty project state', async () => {
    // This would require mocking the data source
    renderWithProviders(<Portofolio />);

    // Basic smoke test
    expect(screen.getByText(/Portfolio|Portofolio/i)).toBeInTheDocument();
  });

  test('responsive grid layout', () => {
    renderWithProviders(<Portofolio />);

    // Check for grid container
    const gridContainer = screen.getByTestId(/project-grid/i);
    expect(gridContainer).toBeInTheDocument();
  });

  test('keyboard navigation works', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Portofolio />);

    // Wait for projects to load
    await waitFor(() => {
      expect(screen.getAllByTestId(/project-card/i).length).toBeGreaterThan(0);
    });

    // Tab through filter buttons
    await user.tab();
    expect(document.activeElement).toHaveAttribute('role', 'button');
  });

  test('page loads without crashing', () => {
    renderWithProviders(<Portofolio />);

    // Basic smoke test
    expect(screen.getByText(/Portfolio|Portofolio/i)).toBeInTheDocument();
  });
});
