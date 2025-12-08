import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

// Mock CSS modules
vi.mock('./Button.module.css', () => ({
  default: {
    button: 'button',
    'button--primary': 'button--primary',
    'button--secondary': 'button--secondary',
    'button--medium': 'button--medium',
    'button--disabled': 'button--disabled',
    'button--loading': 'button--loading',
    loadingSpinner: 'loadingSpinner',
    button__icon: 'button__icon',
    'button__icon--left': 'button__icon--left',
    button__text: 'button__text',
  }
}));

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger click when disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Click Me</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    // 在 loading 状态下，按钮应该被禁用
    expect(screen.getByRole('button')).toBeDisabled();
    // 应该显示加载指示器 (我们 mock 了 class 名)
    // 我们可以检查是否存在具有 loadingSpinner class 的元素，或者检查 disabled 属性
  });

  it('renders icon when provided', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;
    render(<Button icon={<TestIcon />}>With Icon</Button>);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });
});
