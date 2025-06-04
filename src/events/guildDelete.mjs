import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for guildDelete
export default async function (guild) {
    log.debug('guildDelete', { guild });
}
