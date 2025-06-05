import { jest } from '@jest/globals';
import weather from '../../src/commands/weather.mjs';

describe('weather.mjs', () => {
  const baseDeps = () => ({
    log: { debug: jest.fn(), warn: jest.fn(), error: jest.fn() },
    getMsg: jest.fn((locale, key, fallback) => fallback),
    resolveLocationAndUnits: jest.fn().mockResolvedValue({ lat: 1, lon: 2, locationName: 'Testville', units: 'C' }),
    fetchWeather: jest.fn().mockResolvedValue({ main: { temp: 20, feels_like: 19, humidity: 50, pressure: 1013 }, wind: { speed: 2 }, weather: [{ description: 'clear', icon: '01d' }] }),
    generateWeatherReport: jest.fn().mockResolvedValue('Weather is nice!'),
    buildWeatherEmbed: jest.fn().mockReturnValue({ fields: [] })
  });

  it('replies with weather embed on success', async () => {
    const reply = jest.fn();
    const editReply = jest.fn();
    const interaction = {
      locale: 'en-US',
      guildLocale: undefined,
      options: { getString: jest.fn().mockReturnValue('London') },
      reply,
      editReply
    };
    const deps = baseDeps();
    await weather(interaction, deps);
    expect(reply).toHaveBeenCalled();
    expect(editReply).toHaveBeenCalled();
    expect(deps.buildWeatherEmbed).toHaveBeenCalled();
  });

  it('warns and replies if no location', async () => {
    const reply = jest.fn();
    const editReply = jest.fn();
    const interaction = {
      locale: 'en-US',
      guildLocale: undefined,
      options: { getString: jest.fn().mockReturnValue(null) },
      reply,
      editReply
    };
    const deps = baseDeps();
    await weather(interaction, deps);
    expect(deps.log.warn).toHaveBeenCalledWith('No location provided for weather command');
    expect(reply).toHaveBeenCalledWith({ content: expect.any(String) });
  });

  it('replies with error if resolveLocationAndUnits fails', async () => {
    const reply = jest.fn();
    const editReply = jest.fn();
    const interaction = {
      locale: 'en-US',
      guildLocale: undefined,
      options: { getString: jest.fn().mockReturnValue('London') },
      reply,
      editReply
    };
    const deps = baseDeps();
    deps.resolveLocationAndUnits.mockResolvedValue({ lat: null, lon: null, locationName: null, units: null });
    await weather(interaction, deps);
    expect(deps.log.warn).toHaveBeenCalledWith('Failed to get lat/lon for location', expect.any(Object));
    expect(editReply).toHaveBeenCalledWith({ content: expect.any(String) });
  });

  it('replies with error if fetchWeather fails', async () => {
    const reply = jest.fn();
    const editReply = jest.fn();
    const interaction = {
      locale: 'en-US',
      guildLocale: undefined,
      options: { getString: jest.fn().mockReturnValue('London') },
      reply,
      editReply
    };
    const deps = baseDeps();
    deps.fetchWeather.mockResolvedValue(null);
    await weather(interaction, deps);
    expect(deps.log.error).toHaveBeenCalledWith('Failed to get weather data', expect.any(Object));
    expect(editReply).toHaveBeenCalledWith({ content: expect.any(String) });
  });

  it('replies with error if generateWeatherReport fails', async () => {
    const reply = jest.fn();
    const editReply = jest.fn();
    const interaction = {
      locale: 'en-US',
      guildLocale: undefined,
      options: { getString: jest.fn().mockReturnValue('London') },
      reply,
      editReply
    };
    const deps = baseDeps();
    deps.generateWeatherReport.mockResolvedValue(null);
    await weather(interaction, deps);
    expect(deps.log.error).toHaveBeenCalledWith('Failed to get weather report', { locationName: 'Testville' });
    expect(editReply).toHaveBeenCalledWith({ content: expect.any(String) });
  });

  it('logs and replies with error if handler throws', async () => {
    const reply = jest.fn();
    const editReply = jest.fn().mockImplementation(() => { throw new Error('fail'); });
    const interaction = {
      locale: 'en-US',
      guildLocale: undefined,
      options: { getString: jest.fn().mockReturnValue('London') },
      reply,
      editReply
    };
    const deps = baseDeps();
    deps.resolveLocationAndUnits.mockImplementation(() => { throw new Error('fail'); });
    await weather(interaction, deps);
    expect(deps.log.error).toHaveBeenCalledWith('Error in /weather handler', expect.any(Error));
  });
});
