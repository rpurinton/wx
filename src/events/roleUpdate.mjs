import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for roleUpdate
export default async function (oldRole, newRole) {
    log.debug('roleUpdate', { oldRole, newRole });
}
