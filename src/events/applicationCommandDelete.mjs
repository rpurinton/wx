import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for applicationCommandDelete
export default async function (...args) {
    log.debug('applicationCommandDelete', { args });
}
