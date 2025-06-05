import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import log from '../../src/log.mjs';
import { createCronHelpers, initCron } from '../../src/custom/cron.mjs';
import { getCurrentDirname } from '../../src/esm-filename.mjs';

describe('cron.mjs', () => {
  describe('createCronHelpers', () => {
    it('returns an object with initCron', () => {
      const helpers = createCronHelpers({ fs, path, CronJob: jest.fn(), log, resolveLocationAndUnits: jest.fn(), fetchWeather: jest.fn(), generateWeatherReport: jest.fn(), buildWeatherEmbed: jest.fn() });
      expect(typeof helpers.initCron).toBe('function');
    });
  });

  describe('initCron', () => {
    it('logs and returns if cron.json does not exist', async () => {
      const mockFs = { ...fs, existsSync: jest.fn().mockReturnValue(false) };
      const mockLog = { ...log, info: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() };
      const testDir = getCurrentDirname(import.meta);
      await initCron({ channels: { fetch: jest.fn() } }, testDir, { fs: mockFs, path, log: mockLog });
      expect(mockLog.info).toHaveBeenCalledWith('No cron.json found, skipping scheduled reports.');
    });
    // More integration tests would require fs mocks and cron.json fixture
  });
});
