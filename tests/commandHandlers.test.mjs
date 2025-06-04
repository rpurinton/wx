import fs from 'fs';
import path from 'path';

describe('All command handler files export a default function', () => {
  const commandsDir = path.join(process.cwd(), 'src', 'commands');
  const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.mjs'));
  for (const file of files) {
    const filePath = path.join(commandsDir, file);
    test(`${file} exports a default function`, async () => {
      const mod = await import(filePath);
      expect(typeof mod.default).toBe('function');
    });
  }
});
