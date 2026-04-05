import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// 模拟localStorage
const localStorageMock = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// 模拟fetch
Object.defineProperty(globalThis, 'fetch', {
  value: () => Promise.resolve({}),
  writable: true,
});

// 添加空的Jest对象以避免引用错误
Object.defineProperty(globalThis, 'jest', {
  value: {
    clearAllMocks: () => {},
    fn: () => () => {},
  },
  writable: true,
});
