import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  test('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('displays loading state', () => {
    render(<Button isLoading>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-loading', 'true');
    expect(button).toBeDisabled();
  });

  test('displays left icon', () => {
    render(<Button leftIcon={<span data-testid="left-icon">🔍</span>}>Search</Button>);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  test('displays right icon', () => {
    render(<Button rightIcon={<span data-testid="right-icon">→</span>}>Next</Button>);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  test('applies different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveStyle('background: #9ece6a');
    
    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveStyle('background: #444b6a');
    
    rerender(<Button variant="tertiary">Tertiary</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveStyle('background: transparent');
  });
});