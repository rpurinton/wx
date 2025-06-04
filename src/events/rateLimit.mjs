import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for rateLimit
export default async function (rateLimitData) {
    log.debug('rateLimit', { rateLimitData });
}
