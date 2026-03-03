import { describe, it, expect, vi, beforeAll } from 'vitest';
import {
  normalizeInflators,
  buildInflatorMap,
  getInflatorsOnce,
  inflate,
  invalidateInflatorsCache,
} from '../inflation.js';

// Mock the db so getInflatorsOnce() doesn't hit Supabase.
// The mock data gives us a 20% increase from 2020 to 2024.
vi.mock('../db/index.js', () => ({
  db: {
    query: vi.fn().mockResolvedValue({
      rows: [
        { year: '2020', inflation_index: '100' },
        { year: '2024', inflation_index: '120' },
      ],
    }),
  },
}));

// ─── normalizeInflators ───────────────────────────────────────────────────────

describe('normalizeInflators', () => {
  it('coerces year and inflation_index strings to numbers', () => {
    const rows = [{ year: '2020', inflation_index: '100' }];
    expect(normalizeInflators(rows)).toEqual([{ year: 2020, value: 100 }]);
  });

  it('falls back to the value field when inflation_index is absent', () => {
    const rows = [{ year: 2019, value: 95 }];
    expect(normalizeInflators(rows)).toEqual([{ year: 2019, value: 95 }]);
  });

  it('filters out rows with a non-finite year', () => {
    const rows = [
      { year: 'bad', inflation_index: 100 },
      { year: 2021, inflation_index: 110 },
    ];
    expect(normalizeInflators(rows)).toEqual([{ year: 2021, value: 110 }]);
  });

  it('filters out rows with a non-finite value', () => {
    const rows = [
      { year: 2020, inflation_index: NaN },
      { year: 2021, inflation_index: 110 },
    ];
    expect(normalizeInflators(rows)).toEqual([{ year: 2021, value: 110 }]);
  });

  it('returns an empty array for empty input', () => {
    expect(normalizeInflators([])).toEqual([]);
  });
});

// ─── buildInflatorMap ─────────────────────────────────────────────────────────

describe('buildInflatorMap', () => {
  it('builds a Map keyed by year', () => {
    const rows = [
      { year: 2020, value: 100 },
      { year: 2021, value: 105 },
    ];
    const map = buildInflatorMap(rows);
    expect(map).toBeInstanceOf(Map);
    expect(map.get(2020)).toBe(100);
    expect(map.get(2021)).toBe(105);
  });

  it('overwrites duplicate years with the last value', () => {
    const rows = [
      { year: 2020, value: 100 },
      { year: 2020, value: 999 },
    ];
    expect(buildInflatorMap(rows).get(2020)).toBe(999);
  });

  it('returns an empty Map for empty input', () => {
    expect(buildInflatorMap([])).toEqual(new Map());
  });
});

// ─── inflate ──────────────────────────────────────────────────────────────────
// inflate() reads from module-level state populated by getInflatorsOnce().
// We seed that state once before all tests in this block.

describe('inflate', () => {
  beforeAll(async () => {
    invalidateInflatorsCache();
    await getInflatorsOnce();
  });

  it('adjusts a value from 2020 to 2024 (+20%)', () => {
    // 1000 * (120/100) = 1200 — integer result returns without decimals
    expect(inflate(1000, 2020, 2024)).toBe('1200');
  });

  it('returns the value unchanged when fromYear equals toYear', () => {
    expect(inflate(500, 2020, 2020)).toBe('500');
  });

  it('returns empty string for a non-numeric input value', () => {
    expect(inflate('abc', 2020, 2024)).toBe('');
  });

  it('returns the raw value as a string when a year is missing from the map', () => {
    expect(inflate(1000, 2020, 1999)).toBe('1000');
  });
});
