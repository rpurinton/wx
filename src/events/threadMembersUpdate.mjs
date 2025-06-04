import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for threadMembersUpdate
export default async function (addedMembers, removedMembers) {
    log.debug('threadMembersUpdate', { addedMembers, removedMembers });
}
