import { jest } from '@jest/globals';
import { getReport } from '../../src/custom/openai.mjs';

// Mock log object
const mockLog = { debug: jest.fn(), error: jest.fn() };

// Patch global log for this test file if needed
jest.unstable_mockModule('../../src/custom/report.mjs', () => ({
  log: mockLog
}));

describe('openai.mjs', () => {
  describe('named exports', () => {
    it('saveLatLon throws if no API key', async () => {
      // Use dynamic import to allow mocking
      process.env.OPENAI_API_KEY = '';
      const { saveLatLon } = await import('../../src/custom/openai.mjs');
      await expect(saveLatLon('London', 'en-US')).rejects.toThrow('OPENAI_API_KEY not set');
    });
    it('getReport throws if no API key', async () => {
      process.env.OPENAI_API_KEY = '';
      await expect(getReport({}, 'London', 'C', 'en-US')).rejects.toThrow('OPENAI_API_KEY not set');
    });
  });
});
