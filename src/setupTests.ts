import '@testing-library/jest-dom';

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
Object.defineProperty(global, 'fetch', {
  value: () => Promise.resolve({}),
  writable: true,
});

// 添加空的Jest对象以避免引用错误
Object.defineProperty(global, 'jest', {
  value: {
    clearAllMocks: () => {},
    fn: () => () => {},
  },
  writable: true,
});