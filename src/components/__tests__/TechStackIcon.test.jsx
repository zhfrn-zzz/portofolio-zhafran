import React from 'react';
import { render, screen } from '@testing-library/react';
import TechStackIcon from '../TechStackIcon';

describe('TechStackIcon', () => {
  const defaultProps = {
    icon: 'react.svg',
    name: 'React'
  };

  test('renders tech stack icon with correct attributes', () => {
    render(<TechStackIcon {...defaultProps} />);

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/react.svg');
    expect(image).toHaveAttribute('alt', 'React');
  });

  test('renders with different tech stack', () => {
    const props = {
      icon: 'javascript.svg',
      name: 'JavaScript'
    };

    render(<TechStackIcon {...props} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/javascript.svg');
    expect(image).toHaveAttribute('alt', 'JavaScript');
  });

  test('handles missing icon gracefully', () => {
    const props = {
      icon: '',
      name: 'Unknown Tech'
    };

    render(<TechStackIcon {...props} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'Unknown Tech');
  });

  test('applies correct CSS classes', () => {
    render(<TechStackIcon {...defaultProps} />);

    const container = screen.getByRole('img').parentElement;
    expect(container).toHaveClass('tech-icon'); // Assuming this class exists
  });

  test('renders multiple tech stack icons', () => {
    const techStack = [
      { icon: 'react.svg', name: 'React' },
      { icon: 'javascript.svg', name: 'JavaScript' },
      { icon: 'nodejs.svg', name: 'Node.js' }
    ];

    render(
      <div>
        {techStack.map((tech, index) => (
          <TechStackIcon key={index} {...tech} />
        ))}
      </div>
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
    expect(images[0]).toHaveAttribute('alt', 'React');
    expect(images[1]).toHaveAttribute('alt', 'JavaScript');
    expect(images[2]).toHaveAttribute('alt', 'Node.js');
  });
});
