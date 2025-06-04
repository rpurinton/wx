import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { loadAndRegisterCommands } from '../src/commands.mjs';

describe('loadAndRegisterCommands', () => {
  const mockLogger = {
    debug: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };
  const mockRest = jest.fn().mockImplementation(() => ({
    setToken: jest.fn().mockReturnThis(),
    put: jest.fn().mockResolvedValue({})
  }));
  const mockRoutes = {
    applicationCommands: jest.fn((id) => `/apps/${id}/commands`)
  };
  const mockFs = {
    readdirSync: jest.fn(),
    readFileSync: jest.fn(),
    existsSync: jest.fn()
  };
  const mockPath = {
    join: path.join,
    dirname: path.dirname
  };
  const testDir = path.join(process.cwd(), 'tests', 'mock-commands');
  const testJson = '{"name":"help","description":"Help command"}';
  const testHandler = { default: jest.fn() };

  beforeAll(() => {
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);
    fs.writeFileSync(path.join(testDir, 'help.json'), testJson);
    fs.writeFileSync(path.join(testDir, 'help.mjs'), 'export default () => {}');
  });

  afterAll(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('loads and registers commands and handlers', async () => {
    mockFs.readdirSync.mockReturnValue(['help.json']);
    mockFs.readFileSync.mockReturnValue(testJson);
    mockFs.existsSync.mockReturnValue(true);
    const importFn = jest.fn().mockResolvedValue(testHandler);
    const commands = await loadAndRegisterCommands({
      fsLib: mockFs,
      pathLib: mockPath,
      restClass: mockRest,
      routes: mockRoutes,
      token: 'token',
      clientId: 'client',
      logger: mockLogger,
      commandsDirOverride: testDir,
      importFn
    });
    expect(commands.help).toBe(testHandler.default);
    expect(mockLogger.debug).toHaveBeenCalledWith('Registered commands: help');
    expect(importFn).toHaveBeenCalled();
  });

  it('warns if handler is missing', async () => {
    mockFs.readdirSync.mockReturnValue(['help.json']);
    mockFs.readFileSync.mockReturnValue(testJson);
    mockFs.existsSync.mockReturnValue(false);
    const importFn = jest.fn();
    await loadAndRegisterCommands({
      fsLib: mockFs,
      pathLib: mockPath,
      restClass: mockRest,
      routes: mockRoutes,
      token: 'token',
      clientId: 'client',
      logger: mockLogger,
      commandsDirOverride: testDir,
      importFn
    });
    expect(mockLogger.warn).toHaveBeenCalledWith('No handler found for command help');
  });

  it('logs error if command definition fails', async () => {
    mockFs.readdirSync.mockReturnValue(['bad.json']);
    mockFs.readFileSync.mockImplementation(() => { throw new Error('fail'); });
    mockFs.existsSync.mockReturnValue(false);
    const importFn = jest.fn();
    await loadAndRegisterCommands({
      fsLib: mockFs,
      pathLib: mockPath,
      restClass: mockRest,
      routes: mockRoutes,
      token: 'token',
      clientId: 'client',
      logger: mockLogger,
      commandsDirOverride: testDir,
      importFn
    });
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to load command definition for bad.json:'),
      expect.any(Error)
    );
  });
});
