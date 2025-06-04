import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for messageDeleteBulk
export default async function (messages) {
    log.debug('messageDeleteBulk', { messages });
}
