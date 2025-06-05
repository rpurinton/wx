import { jest } from '@jest/globals';
import { createOpenaiHelpers, getLatLon, getReport } from '../../src/custom/openai.mjs';

describe('openai.mjs', () => {
  describe('createOpenaiHelpers', () => {
    it('returns an object with getLatLon and getReport', () => {
      const helpers = createOpenaiHelpers({
        fs: { readFileSync: jest.fn().mockReturnValue('{"messages":[{"content":[{"text":""}]}]}') },
        path: { join: jest.fn(() => 'locate.json') },
        log: { debug: jest.fn(), error: jest.fn() },
        OpenAI: jest.fn(),
        getCurrentDirname: jest.fn()
      });
      expect(typeof helpers.getLatLon).toBe('function');
      expect(typeof helpers.getReport).toBe('function');
    });
  });

  describe('named exports', () => {
    it('getLatLon throws if no API key', async () => {
      process.env.OPENAI_API_KEY = '';
      await expect(getLatLon('London', 'en-US')).rejects.toThrow('OPENAI_API_KEY not set');
    });
    it('getReport throws if no API key', async () => {
      process.env.OPENAI_API_KEY = '';
      await expect(getReport({}, 'London', 'C', 'en-US')).rejects.toThrow('OPENAI_API_KEY not set');
    });
  });
});
