import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for stickerUpdate
export default async function (oldSticker, newSticker) {
    log.debug('stickerUpdate', { oldSticker, newSticker });
}
