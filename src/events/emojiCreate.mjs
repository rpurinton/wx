import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for emojiCreate
export default async function (emoji) {
    log.debug('emojiCreate', { emoji });
}
