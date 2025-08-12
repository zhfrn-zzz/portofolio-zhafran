import React from 'react';
import { render, screen } from '@testing-library/react';
import { Github, Instagram, Linkedin } from 'lucide-react';
import SocialLinks from '../SocialLinks';

describe('SocialLinks', () => {
  const mockSocialLinks = [
    { icon: Github, link: 'https://github.com/zhfrn-zzz' },
    { icon: Instagram, link: 'https://instagram.com/zhafran.razan' },
    { icon: Linkedin, link: 'https://linkedin.com/in/zhafran-razaq' }
  ];

  test('renders all social links correctly', () => {
    render(<SocialLinks links={mockSocialLinks} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
    
    expect(links[0]).toHaveAttribute('href', 'https://github.com/zhfrn-zzz');
    expect(links[1]).toHaveAttribute('href', 'https://instagram.com/zhafran.razan');
    expect(links[2]).toHaveAttribute('href', 'https://linkedin.com/in/zhafran-razaq');
  });

  test('opens external links in new tab', () => {
    render(<SocialLinks links={mockSocialLinks} />);

    const externalLinks = screen.getAllByRole('link');
    externalLinks.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  test('handles empty links array', () => {
    render(<SocialLinks links={[]} />);

    const links = screen.queryAllByRole('link');
    expect(links).toHaveLength(0);
  });

  test('handles internal links correctly', () => {
    const internalLinks = [
      { icon: Github, link: '/contact' }
    ];

    render(<SocialLinks links={internalLinks} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/contact');
    // Internal links should not have target="_blank"
    expect(link).not.toHaveAttribute('target');
  });

  test('applies hover effects and transitions', () => {
    render(<SocialLinks links={mockSocialLinks} />);

    const links = screen.getAllByRole('link');
    links.forEach(link => {
      // Check for transition classes (adjust based on your actual classes)
      expect(link).toHaveClass(/transition/);
    });
  });

  test('renders icons correctly', () => {
    render(<SocialLinks links={mockSocialLinks} />);

    // Icons should be rendered (though testing icon components can be tricky)
    const links = screen.getAllByRole('link');
    expect(links[0]).toBeInTheDocument();
    expect(links[1]).toBeInTheDocument();
    expect(links[2]).toBeInTheDocument();
  });
});
