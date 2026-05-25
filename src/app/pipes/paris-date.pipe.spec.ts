import {ParisDatePipe} from './paris-date.pipe';

describe('ParisDatePipe', () => {
  const pipe = new ParisDatePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('returns empty string for invalid date', () => {
    expect(pipe.transform('not-a-date')).toBe('');
  });

  it('summer ISO Z input → Paris hour is UTC+2', () => {
    expect(pipe.transform('2026-05-24T07:00:00Z', 'H')).toBe('9');
  });

  it('summer ISO Z input → Paris minute is unchanged', () => {
    expect(pipe.transform('2026-05-24T07:30:00Z', 'mm')).toBe('30');
  });

  it('winter ISO Z input → Paris hour is UTC+1', () => {
    expect(pipe.transform('2026-01-15T07:00:00Z', 'H')).toBe('8');
  });

  it('legacy naive string (no Z) is interpreted as UTC', () => {
    expect(pipe.transform('2026-05-24 07:00:00', 'H')).toBe('9');
  });

  it('legacy naive string with T separator is interpreted as UTC', () => {
    expect(pipe.transform('2026-05-24T07:00:00', 'H')).toBe('9');
  });

  it('string with explicit offset is respected', () => {
    expect(pipe.transform('2026-05-24T09:00:00+02:00', 'H')).toBe('9');
  });

  it('Date object input is accepted', () => {
    const d = new Date(Date.UTC(2026, 4, 24, 7, 0, 0));
    expect(pipe.transform(d, 'H')).toBe('9');
  });

  it('fullDate format produces a non-empty French date string', () => {
    const out = pipe.transform('2026-05-24T07:00:00Z', 'fullDate');
    expect(out).toContain('2026');
    expect(out).toContain('mai');
  });

  it('medium format includes year and time digits', () => {
    const out = pipe.transform('2026-05-24T07:00:00Z', 'medium');
    expect(out).toContain('2026');
    expect(out).toMatch(/09/);
  });

  it('crossing midnight in Paris from UTC keeps correct date', () => {
    expect(pipe.transform('2026-05-23T23:30:00Z', 'H')).toBe('1');
  });
});
