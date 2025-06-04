import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for threadMemberUpdate
export default async function (oldMember, newMember) {
    log.debug('threadMemberUpdate', { oldMember, newMember });
}
