import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for threadCreate
export default async function (thread) {
    log.debug('threadCreate', { thread });
}
