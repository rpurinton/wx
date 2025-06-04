import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for guildScheduledEventUserAdd
export default async function (guildScheduledEvent, user) {
    log.debug('guildScheduledEventUserAdd', { guildScheduledEvent, user });
}
