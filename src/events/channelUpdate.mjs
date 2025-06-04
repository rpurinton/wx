import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for channelUpdate
export default async function (oldChannel, newChannel) {
    log.debug('channelUpdate', { oldChannel, newChannel });
}
