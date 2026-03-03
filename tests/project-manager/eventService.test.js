import { describe, it, expect, vi } from 'vitest';
import {
  summarize,
  formatCurrency,
  estimateSummary,
} from '../../project-manager/eventService.js';

// Prevent real Supabase calls when the module is loaded.
vi.mock('../../db/index.js', () => ({
  db: {
    query: vi.fn(),
    insert: vi.fn(),
    getUserId: vi.fn(),
    findOne: vi.fn(),
  },
}));

// ─── summarize ────────────────────────────────────────────────────────────────

describe('summarize', () => {
  it('collapses internal whitespace and trims', () => {
    expect(summarize('  hello   world  ')).toBe('hello world');
  });

  it('truncates to 140 characters', () => {
    expect(summarize('a'.repeat(200))).toHaveLength(140);
  });

  it('handles null gracefully', () => {
    expect(summarize(null)).toBe('');
  });

  it('handles undefined gracefully', () => {
    expect(summarize(undefined)).toBe('');
  });

  it('returns a clean short string unchanged', () => {
    expect(summarize('short text')).toBe('short text');
  });
});

// ─── formatCurrency ───────────────────────────────────────────────────────────

describe('formatCurrency', () => {
  it('formats a positive number as USD', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
  });

  it('formats zero as $0.00', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('treats null as zero', () => {
    expect(formatCurrency(null)).toBe('$0.00');
  });

  it('treats undefined as zero', () => {
    expect(formatCurrency(undefined)).toBe('$0.00');
  });

  it('formats a large number with comma separators', () => {
    expect(formatCurrency(1_000_000)).toBe('$1,000,000.00');
  });
});

// ─── estimateSummary ─────────────────────────────────────────────────────────

describe('estimateSummary', () => {
  it('builds a joined summary with all fields', () => {
    const result = estimateSummary({
      estimateType: 'Preliminary',
      status: 'approved',
      estimateDate: '2024-06-15T00:00:00Z',
      estimateAwardYear: 2025,
      totalAmount: 5000,
    });
    expect(result).toBe('Preliminary • Approved • 2024-06-15 • Award 2025 • $5,000.00');
  });

  it('omits estimateAwardYear when null', () => {
    const result = estimateSummary({
      estimateType: 'Rough',
      status: 'draft',
      estimateDate: '2024-01-01',
      estimateAwardYear: null,
      totalAmount: 100,
    });
    expect(result).not.toContain('Award');
  });

  it('defaults status to Draft when falsy', () => {
    const result = estimateSummary({
      estimateType: 'ROM',
      status: '',
      estimateDate: null,
      estimateAwardYear: null,
      totalAmount: 0,
    });
    expect(result).toContain('Draft');
  });

  it('capitalizes the first letter of status', () => {
    const result = estimateSummary({
      estimateType: 'ROM',
      status: 'approved',
      estimateDate: null,
      estimateAwardYear: null,
      totalAmount: 0,
    });
    expect(result).toContain('Approved');
  });

  it('truncates the result to 140 characters', () => {
    const result = estimateSummary({
      estimateType: 'E'.repeat(200),
      status: 'approved',
      estimateDate: null,
      estimateAwardYear: null,
      totalAmount: 0,
    });
    expect(result.length).toBeLessThanOrEqual(140);
  });
});
