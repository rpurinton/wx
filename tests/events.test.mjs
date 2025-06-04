import fs from 'fs';
import path from 'path';
import { jest } from '@jest/globals';
import setupEvents from '../src/events.mjs';

describe('setupEvents', () => {
  let client;
  let eventDir;
  let eventFile;
  let origReaddirSync;
  let origImport;

  beforeAll(() => {
    eventDir = path.join(process.cwd(), 'tests', 'mock-events');
    if (!fs.existsSync(eventDir)) fs.mkdirSync(eventDir);
    eventFile = path.join(eventDir, 'ready.mjs');
    fs.writeFileSync(eventFile, 'export default () => {}');
    origReaddirSync = fs.readdirSync;
    origImport = globalThis.__import;
  });

  afterAll(() => {
    fs.rmSync(eventDir, { recursive: true, force: true });
    if (origImport) globalThis.__import = origImport;
  });

  it('loads and attaches event handlers', async () => {
    const mockClient = { on: jest.fn() };
    const mockMeta = {};
    const mockEventsDir = eventDir;
    const files = ['ready.mjs'];
    jest.spyOn(fs, 'readdirSync').mockReturnValue(files);
    const importFn = jest.fn().mockResolvedValue({ default: jest.fn() });
    const origImportFn = globalThis.__import;
    globalThis.__import = importFn;
    const origImport = globalThis.import;
    globalThis.import = importFn;
    await setupEvents(mockClient, mockMeta, mockEventsDir);
    expect(mockClient.on).toHaveBeenCalledWith('ready', expect.any(Function));
    if (origImport) globalThis.import = origImport;
    globalThis.__import = origImportFn;
    jest.restoreAllMocks();
  });
});
