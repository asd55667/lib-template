import { describe, it, expect } from 'vitest';
import { sum } from '../src/utils/sum';

describe('sum function', () => {
  it('should add two positive numbers correctly', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(sum(-1, -2)).toBe(-3);
    expect(sum(-1, 5)).toBe(4);
  });

  it('should handle zero', () => {
    expect(sum(0, 5)).toBe(5);
    expect(sum(5, 0)).toBe(5);
    expect(sum(0, 0)).toBe(0);
  });
}); 