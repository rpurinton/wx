import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for messageReactionRemoveAll
export default async function (message, reactions) {
    log.debug('messageReactionRemoveAll', { message, reactions });
}
