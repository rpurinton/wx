import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for threadUpdate
export default async function (oldThread, newThread) {
    log.debug('threadUpdate', { oldThread, newThread });
}
