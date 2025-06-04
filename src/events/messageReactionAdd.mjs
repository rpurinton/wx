import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for messageReactionAdd
export default async function (reaction, user) {
    log.debug('messageReactionAdd', { reaction, user });
}
