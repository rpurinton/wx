import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for messageUpdate
export default async function (oldMessage, newMessage) {
    log.debug('messageUpdate', { oldMessage, newMessage });
}
