import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for guildScheduledEventUpdate
export default async function (oldGuildScheduledEvent, newGuildScheduledEvent) {
    log.debug('guildScheduledEventUpdate', { oldGuildScheduledEvent, newGuildScheduledEvent });
}
