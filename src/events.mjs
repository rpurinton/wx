import log from './log.mjs';
import { readdirSync } from 'fs';
import { join, basename, dirname } from 'path';
import { getCurrentFilename } from './esm-filename.mjs';

/**
 * Loads and attaches all event handlers from the events directory to the Discord client.
 * @param {Object} client - The Discord client instance.
 * @param {ImportMeta} meta - The import.meta object (optional, for testability).
 * @param {string} eventsDirOverride - Optional override for the events directory (for testability).
 * @returns {string[]} - Array of loaded event names.
 */
const setupEvents = async (client, meta = import.meta, eventsDirOverride) => {
    const __filename = getCurrentFilename(meta);
    const __dirname = dirname(__filename);
    const eventsDir = eventsDirOverride || join(__dirname, 'events');
    const files = readdirSync(eventsDir).filter(f => f.endsWith('.mjs'));
    const loadedEvents = [];
    for (const file of files) {
        const eventName = basename(file, '.mjs');
        try {
            const mod = await import(join(eventsDir, file));
            if (!client) throw new Error('Discord client is undefined');
            client.on(eventName, mod.default);
            loadedEvents.push(eventName);
        } catch (err) {
            log.error(`Failed to load event ${eventName}:`, err);
        }
    }
    return loadedEvents;
};

export default setupEvents;