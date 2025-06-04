import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for guildMemberAvailable
export default async function (member) {
    log.debug('guildMemberAvailable', { member });
}
