import { render, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NavigationProvider, useNavigation } from './NavigationContext';

// 测试组件，用于访问 Context
const TestComponent = () => {
  const { state, navigateTo, goBack } = useNavigation();
  return (
    <div>
      <div data-testid="current-module">{state.currentModule}</div>
      <button onClick={() => navigateTo('settings')}>Go to Settings</button>
      <button onClick={() => goBack()}>Go Back</button>
    </div>
  );
};

describe('NavigationContext', () => {
  beforeEach(() => {
    // 重置 URL
    window.location.hash = '';
    vi.clearAllMocks();
  });

  it('provides default module as dashboard', () => {
    const { getByTestId } = render(
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    );
    expect(getByTestId('current-module').textContent).toBe('dashboard');
  });

  it('updates state when navigateTo is called', async () => {
    const { getByText, getByTestId } = render(
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    );

    act(() => {
      getByText('Go to Settings').click();
    });

    // 等待 hash 变化触发的状态更新
    await waitFor(() => {
      expect(window.location.hash).toBe('#/settings');
      expect(getByTestId('current-module').textContent).toBe('settings');
    });
  });

  it('updates state when hash changes manually', async () => {
    const { getByTestId } = render(
      <NavigationProvider>
        <TestComponent />
      </NavigationProvider>
    );

    act(() => {
      window.location.hash = '#/patients';
    });

    await waitFor(() => {
      expect(getByTestId('current-module').textContent).toBe('patients');
    });
  });
  
  // 注意：测试 goBack 比较困难，因为 JSDOM 的 history.back() 行为可能受限
  // 我们主要验证 navigateTo 和 hash 响应机制
});
