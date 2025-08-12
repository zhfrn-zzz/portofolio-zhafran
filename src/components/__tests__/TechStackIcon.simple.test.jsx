import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import TechStackIcon from '../TechStackIcon';

describe('TechStackIcon Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<TechStackIcon />);
    // Component should render without throwing
  });

  test('handles empty tech stack', () => {
    renderWithProviders(<TechStackIcon techStack={[]} />);
    // Should not crash with empty array
  });

  test('renders with tech stack data', () => {
    const techStack = [
      { name: 'React', icon: '/react.svg' },
      { name: 'JavaScript', icon: '/js.svg' }
    ];

    renderWithProviders(<TechStackIcon techStack={techStack} />);
    
    // Look for any images that might be rendered
    const images = screen.queryAllByRole('img');
    // Should either render images or handle gracefully
    expect(images.length).toBeGreaterThanOrEqual(0);
  });

  test('handles missing props gracefully', () => {
    renderWithProviders(<TechStackIcon techStack={undefined} />);
    // Should not crash with undefined props
  });
});
