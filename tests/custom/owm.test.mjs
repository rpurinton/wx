import { jest } from '@jest/globals';
import { createOwmHelpers, getWeatherData } from '../../src/custom/owm.mjs';

describe('owm.mjs', () => {
  describe('createOwmHelpers', () => {
    it('returns an object with getWeatherData', () => {
      const helpers = createOwmHelpers({ fetch: jest.fn(), log: { error: jest.fn() } });
      expect(typeof helpers.getWeatherData).toBe('function');
    });
  });

  describe('named exports', () => {
    it('getWeatherData throws if no API key', async () => {
      process.env.OWM_API_KEY = '';
      await expect(getWeatherData(0, 0, 'C')).rejects.toThrow('OWM_API_KEY is not set in environment variables');
    });
  });
});
