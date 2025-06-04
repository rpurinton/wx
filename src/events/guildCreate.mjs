import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for guildCreate
export default async function (guild) {
    log.debug('guildCreate', { guild });
}
