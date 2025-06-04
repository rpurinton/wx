import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for messageDelete
export default async function (message) {
    log.debug('messageDelete', { message });
}
