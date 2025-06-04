import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for applicationCommandCreate
export default async function (...args) {
    log.debug('applicationCommandCreate', { args });
}
