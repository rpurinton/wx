import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for guildScheduledEventUserRemove
export default async function (guildScheduledEvent, user) {
    log.debug('guildScheduledEventUserRemove', { guildScheduledEvent, user });
}
