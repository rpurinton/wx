import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for guildMemberUpdate
export default async function (oldMember, newMember) {
    log.debug('guildMemberUpdate', { oldMember, newMember });
}
