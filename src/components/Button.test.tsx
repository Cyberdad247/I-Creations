import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import '@testing-library/jest-dom';

describe('Button', () => {
  // Basic Rendering
  test('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle({
      padding: '12px 24px', // medium size
      fontSize: '1rem'
    });
  });

  // Event Handling
  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('prevents click when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
    expect(button).toHaveStyle({ cursor: 'not-allowed', opacity: '0.6' });
  });

  // Loading State
  test('displays loading state correctly', () => {
    render(<Button isLoading>Click me</Button>);
    const button = screen.getByRole('button');
    const spinner = button.querySelector('div'); // LoadingSpinner

    expect(button).toHaveAttribute('data-loading', 'true');
    expect(button).toBeDisabled();
    expect(spinner).toHaveStyle({
      animation: 'spin 1s ease-in-out infinite'
    });
    expect(button).toHaveStyle({ cursor: 'not-allowed', opacity: '0.6' });
  });

  // Icons
  test('displays left icon correctly', () => {
    render(<Button leftIcon={<span data-testid="left-icon">🔍</span>}>Search</Button>);
    const icon = screen.getByTestId('left-icon');
    const wrapper = icon.parentElement;
    expect(icon).toBeInTheDocument();
    expect(wrapper).toHaveStyle({ marginRight: '8px' });
  });

  test('displays right icon correctly', () => {
    render(<Button rightIcon={<span data-testid="right-icon">→</span>}>Next</Button>);
    const icon = screen.getByTestId('right-icon');
    const wrapper = icon.parentElement;
    expect(icon).toBeInTheDocument();
    expect(wrapper).toHaveStyle({ marginLeft: '8px' });
  });

  test('hides icons when loading', () => {
    render(
      <Button 
        isLoading 
        leftIcon={<span data-testid="left-icon">🔍</span>}
        rightIcon={<span data-testid="right-icon">→</span>}
      >
        Search
      </Button>
    );
    expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument();
  });

  // Variants
  describe('button variants', () => {
    test('renders primary variant correctly', () => {
      render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveStyle({
        background: '#9ece6a',
        color: '#1a1b26'
      });
    });

    test('renders secondary variant correctly', () => {
      render(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toHaveStyle({
        background: '#444b6a',
        color: '#c0caf5'
      });
    });

    test('renders tertiary variant correctly', () => {
      render(<Button variant="tertiary">Tertiary</Button>);
      expect(screen.getByRole('button')).toHaveStyle({
        background: 'transparent',
        color: '#7aa2f7',
        border: '1px solid #7aa2f7'
      });
    });
  });

  // Sizes
  describe('button sizes', () => {
    test('renders small size correctly', () => {
      render(<Button size="small">Small</Button>);
      expect(screen.getByRole('button')).toHaveStyle({
        padding: '8px 16px',
        fontSize: '0.875rem'
      });
    });

    test('renders medium size correctly', () => {
      render(<Button size="medium">Medium</Button>);
      expect(screen.getByRole('button')).toHaveStyle({
        padding: '12px 24px',
        fontSize: '1rem'
      });
    });

    test('renders large size correctly', () => {
      render(<Button size="large">Large</Button>);
      expect(screen.getByRole('button')).toHaveStyle({
        padding: '16px 32px',
        fontSize: '1.125rem'
      });
    });
  });

  // Hover and Active States
  test('applies hover styles when not disabled or loading', () => {
    render(<Button>Hover me</Button>);
    const button = screen.getByRole('button');
    fireEvent.mouseOver(button);
    expect(button).toHaveStyle({ transform: 'translateY(-2px)' });
  });

  test('does not apply hover styles when disabled', () => {
    render(<Button disabled>Hover me</Button>);
    const button = screen.getByRole('button');
    fireEvent.mouseOver(button);
    expect(button).not.toHaveStyle({ transform: 'translateY(-2px)' });
  });

  test('does not apply hover styles when loading', () => {
    render(<Button isLoading>Hover me</Button>);
    const button = screen.getByRole('button');
    fireEvent.mouseOver(button);
    expect(button).not.toHaveStyle({ transform: 'translateY(-2px)' });
  });
});