import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for error
export default async function (error) {
    log.debug('error', { error });
}
