import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Global test setup
// Mock ResizeObserver which is needed by Recharts
if (typeof window !== 'undefined') {
  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}

// Global test setup can go here
