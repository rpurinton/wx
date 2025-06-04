import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for emojiUpdate
export default async function (oldEmoji, newEmoji) {
    log.debug('emojiUpdate', { oldEmoji, newEmoji });
}
