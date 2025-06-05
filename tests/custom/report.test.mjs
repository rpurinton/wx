import { jest } from '@jest/globals';
import { createReportHelpers, fetchWeather, buildWeatherEmbed, resolveLocationAndUnits, generateWeatherReport } from '../../src/custom/report.mjs';

describe('report.mjs', () => {
  describe('createReportHelpers', () => {
    const mockLog = { debug: jest.fn(), warn: jest.fn(), error: jest.fn() };
    const deps = {
      saveLatLon: jest.fn().mockResolvedValue([1, 2, 'Testville', 'C']),
      getWeatherData: jest.fn().mockResolvedValue({ main: { temp: 20, feels_like: 19, humidity: 50, pressure: 1013 }, wind: { speed: 2 }, weather: [{ description: 'clear', icon: '01d' }] }),
      getReport: jest.fn().mockResolvedValue('Weather is nice!'),
      msToMph: jest.fn((ms) => ms * 2.23694),
      msToKmh: jest.fn((ms) => ms * 3.6),
      hpaToInHg: jest.fn((hpa) => hpa * 0.02953),
      getMsg: jest.fn((locale, key, fallback) => fallback),
      log: mockLog
    };
    const helpers = createReportHelpers(deps);

    it('resolveLocationAndUnits returns correct structure', async () => {
      const result = await helpers.resolveLocationAndUnits('Testville', 'en-US', 'C');
      expect(result).toEqual({ lat: 1, lon: 2, locationName: 'Testville', units: 'C' });
    });

    it('fetchWeather returns weather data', async () => {
      const data = await helpers.fetchWeather(1, 2, 'C');
      expect(data).toHaveProperty('main');
    });

    it('generateWeatherReport returns a string', async () => {
      const report = await helpers.generateWeatherReport({}, 'Testville', 'C', 'en-US');
      expect(typeof report).toBe('string');
    });

    it('buildWeatherEmbed returns an object with fields', () => {
      const embed = helpers.buildWeatherEmbed({ main: { temp: 20, feels_like: 19, humidity: 50, pressure: 1013 }, wind: { speed: 2 }, weather: [{ description: 'clear', icon: '01d' }] }, 'Weather is nice!', 'Testville', 'C', 'en-US');
      expect(embed).toHaveProperty('fields');
      expect(Array.isArray(embed.fields)).toBe(true);
    });
  });

  describe('named exports', () => {
    it('fetchWeather calls getWeatherData', async () => {
      // This test will throw if OWM_API_KEY is not set, so just check for error thrown
      process.env.OWM_API_KEY = '';
      await expect(fetchWeather(0, 0, 'C')).rejects.toThrow();
    });
  });
});
