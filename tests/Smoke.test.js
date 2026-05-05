// ── Smoke tests — validates all exports load correctly ──

describe('utilities-library smoke', () => {
  it('should export format utilities', async () => {
    const { formatCompact, formatNumber, formatCost, formatDuration } = await import('../src/index.js');
    expect(typeof formatCompact).toBe('function');
    expect(typeof formatNumber).toBe('function');
    expect(typeof formatCost).toBe('function');
    expect(typeof formatDuration).toBe('function');
  });

  it('should export text utilities', async () => {
    const { stripHtml, truncate, escapeRegex } = await import('../src/index.js');
    expect(typeof stripHtml).toBe('function');
    expect(typeof truncate).toBe('function');
    expect(typeof escapeRegex).toBe('function');
  });

  it('formatCompact should format numbers', async () => {
    const { formatCompact } = await import('../src/index.js');
    expect(formatCompact(1500)).toBeTruthy();
  });

  it('truncate should shorten strings', async () => {
    const { truncate } = await import('../src/index.js');
    const result = truncate('Hello World', 5);
    expect(result.length).toBeLessThanOrEqual(8); // 5 + "..."
  });
});
