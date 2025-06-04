import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for guildUnavailable
export default async function (guild) {
    log.debug('guildUnavailable', { guild });
}
