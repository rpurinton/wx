import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for guildMemberRemove
export default async function (member) {
    log.debug('guildMemberRemove', { member });
}
