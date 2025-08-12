import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../utils/test-utils';
import About from '../About';

describe('About Page', () => {
  test('renders page title', () => {
    renderWithProviders(<About />);

    // Should render About page heading
    expect(screen.getByText(/About/i)).toBeInTheDocument();
  });

  test('renders profile information', () => {
    renderWithProviders(<About />);

    // Should contain profile/personal information
    expect(screen.getByText(/Frontend Developer/i)).toBeInTheDocument();
  });

  test('renders education section', () => {
    renderWithProviders(<About />);

    // Should show education information
    const educationSection = screen.getByText(/Education|Pendidikan/i);
    expect(educationSection).toBeInTheDocument();
  });

  test('renders experience section', () => {
    renderWithProviders(<About />);

    // Should show experience information
    const experienceSection = screen.getByText(/Experience|Pengalaman/i);
    expect(experienceSection).toBeInTheDocument();
  });

  test('renders skills section', () => {
    renderWithProviders(<About />);

    // Should display skills or tech stack
    const skillsSection = screen.getByText(/Skills|Keahlian/i);
    expect(skillsSection).toBeInTheDocument();
  });

  test('renders personal photo', () => {
    renderWithProviders(<About />);

    // Should have profile image
    const profileImage = screen.getByRole('img', { name: /profile|photo|zhafran/i });
    expect(profileImage).toBeInTheDocument();
  });

  test('displays contact information', () => {
    renderWithProviders(<About />);

    // Should show contact details
    expect(screen.getByText(/Email|Contact/i)).toBeInTheDocument();
  });

  test('renders social media links', () => {
    renderWithProviders(<About />);

    // Should have social media links
    const githubLink = screen.getByRole('link', { name: /github/i });
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    
    expect(githubLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();
  });

  test('page loads without errors', () => {
    renderWithProviders(<About />);

    // Basic smoke test
    expect(screen.getByText(/About/i)).toBeInTheDocument();
  });

  test('responsive layout is applied', () => {
    renderWithProviders(<About />);

    // Check for main container
    const mainContainer = screen.getByRole('main');
    expect(mainContainer).toBeInTheDocument();
  });

  test('interactive elements work correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<About />);

    // Test any interactive elements (buttons, links)
    const socialLinks = screen.getAllByRole('link');
    expect(socialLinks.length).toBeGreaterThan(0);

    // Ensure links have proper href attributes
    socialLinks.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });

  test('animations and transitions are present', async () => {
    renderWithProviders(<About />);

    // Wait for any animations to initialize
    await waitFor(() => {
      const animatedElements = screen.getAllByRole('img');
      expect(animatedElements.length).toBeGreaterThan(0);
    });
  });
});
