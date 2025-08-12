import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../components/ThemeProvider';
import { I18nProvider } from '../components/I18nProvider';

// Custom render function yang include essential providers
export function renderWithProviders(ui, options = {}) {
  const AllTheProviders = ({ children }) => {
    return (
      <BrowserRouter>
        <I18nProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </I18nProvider>
      </BrowserRouter>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
}

// Mock data untuk testing
export const mockProjectData = {
  id: 1,
  title: "Test Project",
  description: "Test Description",
  img: "/test-image.jpg",
  link: "https://test.com",
  category: "web"
};

export const mockFormData = {
  name: "Test User",
  email: "test@example.com",
  subject: "Test Subject",
  message: "Test Message"
};

// Helper untuk wait for async operations
export const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));
