import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Home from '../Home';

describe('Home Page', () => {
  test('renders main heading', () => {
    renderWithProviders(<Home />);

    // Check for "Frontend" text which is part of the main title
    expect(screen.getByText('Frontend')).toBeInTheDocument();
  });

  test('renders status badge', () => {
    renderWithProviders(<Home />);

    // Should render the status badge component
    const statusElements = screen.getAllByText(/Siap/i);
    expect(statusElements.length).toBeGreaterThan(0);
  });

  test('renders typing animation container', () => {
    renderWithProviders(<Home />);

    // The typing animation should be present
    // Look for one of the words that should appear in typing animation
    const animationContainer = screen.getByTestId('typing-animation');
    expect(animationContainer).toBeInTheDocument();
  });

  test('renders tech stack section', () => {
    renderWithProviders(<Home />);

    // Tech stack should be rendered
    const techStackSection = screen.getByTestId('tech-stack');
    expect(techStackSection).toBeInTheDocument();
  });

  test('renders social links section', () => {
    renderWithProviders(<Home />);

    // Social links should be present
    const socialSection = screen.getByTestId('social-links');
    expect(socialSection).toBeInTheDocument();
  });

  test('renders CTA buttons', () => {
    renderWithProviders(<Home />);

    // Should have portfolio and contact buttons
    const portfolioButton = screen.getByRole('button', { name: /portfolio|portofolio/i });
    const contactButton = screen.getByRole('button', { name: /contact|kontak/i });
    
    expect(portfolioButton).toBeInTheDocument();
    expect(contactButton).toBeInTheDocument();
  });

  test('renders 3D Lanyard component', () => {
    renderWithProviders(<Home />);

    // Mock 3D component should be rendered
    expect(screen.getByTestId('lanyard-3d')).toBeInTheDocument();
  });

  test('page loads without crashing', () => {
    renderWithProviders(<Home />);

    // Basic smoke test - page should render without throwing
    expect(screen.getByText('Frontend')).toBeInTheDocument();
  });

  test('responsive design elements are present', () => {
    renderWithProviders(<Home />);

    // Check for responsive layout elements
    const mainContainer = screen.getByRole('main');
    expect(mainContainer).toBeInTheDocument();
  });

  test('background animations are rendered', () => {
    renderWithProviders(<Home />);

    // Background component should be present
    const backgroundElement = screen.getByTestId('background-animation');
    expect(backgroundElement).toBeInTheDocument();
  });
});
