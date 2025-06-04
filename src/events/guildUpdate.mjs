import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for guildUpdate
export default async function (oldGuild, newGuild) {
    log.debug('guildUpdate', { oldGuild, newGuild });
}
