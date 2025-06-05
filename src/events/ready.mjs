import log from '../log.mjs';
import { initCron } from '../custom/cron.mjs';
import { getCurrentDirname } from '../esm-filename.mjs';
import path from 'path';

// Refactor for DI: add dependencies as the second argument with defaults
export default async function (
    client,
    {
        log: logDep = log,
        initCron: initCronDep = initCron,
        getCurrentDirname: getCurrentDirnameDep = getCurrentDirname,
        path: pathDep = path
    } = {}
) {
    try {
        logDep.info(`Logged in as ${client.user.tag}`);
        client.user.setPresence({ activities: [{ name: '⛅ Weather App', type: 4 }], status: 'online' });
        // Initialize cron system if configured
        // Go up two directories from src/events/ready.mjs to reach project root
        const rootDir = getCurrentDirnameDep(import.meta, (filename) => {
            return pathDep.dirname(pathDep.dirname(pathDep.dirname(filename)));
        });
        await initCronDep(client, rootDir);
    } catch (err) {
        logDep.error('Error in ready event handler', err);
    }
}