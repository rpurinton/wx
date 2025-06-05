import { jest } from '@jest/globals';
import ready from '../../src/events/ready.mjs';

describe('ready.mjs', () => {
  it('logs in, sets presence, and calls initCron', async () => {
    const logDep = { info: jest.fn(), error: jest.fn() };
    const setPresence = jest.fn();
    const client = { user: { tag: 'TestUser', setPresence } };
    const initCron = jest.fn();
    const getCurrentDirname = jest.fn().mockReturnValue('/root');
    const pathDep = { dirname: jest.fn((p) => p + '/..') };
    await ready(client, { log: logDep, initCron, getCurrentDirname, path: pathDep });
    expect(logDep.info).toHaveBeenCalledWith('Logged in as TestUser');
    expect(setPresence).toHaveBeenCalledWith({ activities: [{ name: '⛅ Weather App', type: 4 }], status: 'online' });
    expect(initCron).toHaveBeenCalledWith(client, '/root');
  });

  it('logs error if something fails', async () => {
    const logDep = { info: jest.fn(), error: jest.fn() };
    const setPresence = jest.fn(() => { throw new Error('fail'); });
    const client = { user: { tag: 'TestUser', setPresence } };
    const initCron = jest.fn();
    const getCurrentDirname = jest.fn().mockReturnValue('/root');
    const pathDep = { dirname: jest.fn((p) => p + '/..') };
    await ready(client, { log: logDep, initCron, getCurrentDirname, path: pathDep });
    expect(logDep.error).toHaveBeenCalledWith('Error in ready event handler', expect.any(Error));
  });
});
