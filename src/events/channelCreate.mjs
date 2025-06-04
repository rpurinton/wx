import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for channelCreate
export default async function (channel) {
    log.debug('channelCreate', { channel });
}
