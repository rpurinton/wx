import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for channelPinsUpdate
export default async function (channel, time) {
    log.debug('channelPinsUpdate', { channel, time });
}
