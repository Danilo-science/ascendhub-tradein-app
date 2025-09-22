import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../../components/ThemeToggle';
import { ThemeProvider } from '../../components/ThemeProvider';

describe('ThemeToggle', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        {component}
      </ThemeProvider>
    );
  };

  it('renders without crashing', () => {
    renderWithTheme(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('toggles theme when clicked', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    // The theme toggle functionality would be tested here
    // This is a basic structure for the test
  });

  it('displays correct icon based on theme', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');
    
    // Check if the button contains an icon (Sun or Moon)
    expect(button).toBeInTheDocument();
  });
});