import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for threadDelete
export default async function (thread) {
    log.debug('threadDelete', { thread });
}
