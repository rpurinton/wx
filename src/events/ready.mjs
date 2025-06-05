import log from '../log.mjs';
import { getMsg } from '../locales.mjs';
import { initCron } from '../custom/cron.mjs';
import { getCurrentDirname } from '../esm-filename.mjs';
import path from 'path';

// Event handler for ready
export default async function (client) {
    log.info(`Logged in as ${client.user.tag}`);
    client.user.setPresence({ activities: [{ name: '⛅ Weather App', type: 4 }], status: 'online' });
    // Initialize cron system if configured
    // Go up two directories from src/events/ready.mjs to reach project root
    const rootDir = getCurrentDirname(import.meta, (filename) => {
        return path.dirname(path.dirname(path.dirname(filename)));
    });
    await initCron(client, rootDir);
}
