import { describe, it, expect } from 'vitest';
import { multiply } from '@wcw2025/lib-template';

describe('multiply function', () => {
  it('should multiply two positive numbers correctly', () => {
    expect(multiply(2, 3)).toBe(6);
  });

  it('should handle negative numbers', () => {
    expect(multiply(-1, -2)).toBe(2);
    expect(multiply(-1, 5)).toBe(-5);
  });

  it('should handle zero', () => {
    expect(multiply(0, 5)).toBe(0);
    expect(multiply(5, 0)).toBe(0);
    expect(multiply(0, 0)).toBe(0);
  });
});
