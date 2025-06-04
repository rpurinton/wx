import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for guildMemberAdd
export default async function (member) {
    log.debug('guildMemberAdd', { member });
}
