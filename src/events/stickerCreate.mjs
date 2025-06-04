import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for stickerCreate
export default async function (sticker) {
    log.debug('stickerCreate', { sticker });
}
