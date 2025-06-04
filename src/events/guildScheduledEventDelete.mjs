import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for guildScheduledEventDelete
export default async function (guildScheduledEvent) {
    log.debug('guildScheduledEventDelete', { guildScheduledEvent });
}
