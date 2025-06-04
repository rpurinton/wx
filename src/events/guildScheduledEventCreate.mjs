import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for guildScheduledEventCreate
export default async function (guildScheduledEvent) {
    log.debug('guildScheduledEventCreate', { guildScheduledEvent });
}
