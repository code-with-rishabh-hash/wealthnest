import { describe, it, expect, vi, afterEach } from 'vitest';
import { daysUntil } from './date';

describe('daysUntil', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return 0 for today', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(daysUntil(today)).toBe(0);
  });

  it('should return positive number for future dates', () => {
    const future = new Date();
    future.setDate(future.getDate() + 10);
    expect(daysUntil(future.toISOString().split('T')[0])).toBe(10);
  });

  it('should return negative number for past dates', () => {
    const past = new Date();
    past.setDate(past.getDate() - 5);
    expect(daysUntil(past.toISOString().split('T')[0])).toBe(-5);
  });

  it('should return 1 for tomorrow', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(daysUntil(tomorrow.toISOString().split('T')[0])).toBe(1);
  });

  it('should return -1 for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(daysUntil(yesterday.toISOString().split('T')[0])).toBe(-1);
  });
});
