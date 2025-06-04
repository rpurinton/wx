import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for warn
export default async function (info) {
    log.debug('warn', { info });
}
