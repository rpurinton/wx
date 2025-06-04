import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for messageReactionRemoveEmoji
export default async function (reaction) {
    log.debug('messageReactionRemoveEmoji', { reaction });
}
