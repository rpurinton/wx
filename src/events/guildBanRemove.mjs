import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for guildBanRemove
export default async function (ban) {
    log.debug('guildBanRemove', { ban });
}
