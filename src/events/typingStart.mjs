import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for typingStart
export default async function (typing) {
    log.debug('typingStart', { typing });
}
