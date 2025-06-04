import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for messageBulkDelete
export default async function (messages) {
    log.debug('messageBulkDelete', { messages });
}
