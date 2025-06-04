import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for guildBanAdd
export default async function (ban) {
    log.debug('guildBanAdd', { ban });
}
