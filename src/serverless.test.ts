import { describe, it, expect } from 'vitest';
import handler from './serverless.js';

describe('Serverless Framework v4 entry', () => {
  it('default-exports a web-standard fetch handler', () => {
    expect(handler).toBeDefined();
    expect(typeof (handler as unknown as { fetch: unknown }).fetch).toBe('function');
  });
});
