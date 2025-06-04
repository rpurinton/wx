import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for debug
export default async function (info) {
    log.debug('debug', { info });
}
