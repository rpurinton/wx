import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for messageReactionRemove
export default async function (reaction, user) {
    log.debug('messageReactionRemove', { reaction, user });
}
