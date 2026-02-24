import { describe, it, expect } from 'vitest';
import { formatMoney, toMonthKey, monthLabel } from './format';
describe('formatMoney', () => {
    it('should format amounts in Crores for >= 1 crore', () => {
        expect(formatMoney(10000000, '₹')).toBe('₹1.00Cr');
        expect(formatMoney(25000000, '₹')).toBe('₹2.50Cr');
    });
    it('should format amounts in Lakhs for >= 1 lakh', () => {
        expect(formatMoney(100000, '₹')).toBe('₹1.00L');
        expect(formatMoney(550000, '₹')).toBe('₹5.50L');
    });
    it('should format amounts with commas for >= 1000', () => {
        expect(formatMoney(1000, '₹')).toMatch(/₹1,000/);
        expect(formatMoney(50000, '₹')).toMatch(/₹50,000/);
    });
    it('should format small amounts with 2 decimal places', () => {
        expect(formatMoney(42.5, '₹')).toBe('₹42.50');
        expect(formatMoney(0.99, '₹')).toBe('₹0.99');
    });
    it('should handle zero', () => {
        expect(formatMoney(0, '₹')).toBe('₹0.00');
    });
    it('should handle negative amounts as absolute value', () => {
        expect(formatMoney(-100000, '₹')).toBe('₹1.00L');
    });
    it('should handle null/undefined as 0', () => {
        expect(formatMoney(undefined, '$')).toBe('$0.00');
        expect(formatMoney(null, '$')).toBe('$0.00');
    });
    it('should work with different currency symbols', () => {
        expect(formatMoney(1000, '$')).toMatch(/\$1,000/);
        expect(formatMoney(1000, '€')).toMatch(/€1,000/);
    });
});
describe('toMonthKey', () => {
    it('should convert date to YYYY-MM format', () => {
        expect(toMonthKey('2025-01-15')).toBe('2025-01');
        expect(toMonthKey('2025-12-31')).toBe('2025-12');
    });
});
describe('monthLabel', () => {
    it('should convert YYYY-MM to human readable', () => {
        const label = monthLabel('2025-01');
        expect(label).toContain('Jan');
        expect(label).toContain('2025');
    });
});
//# sourceMappingURL=format.test.js.map