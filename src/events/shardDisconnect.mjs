import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for shardDisconnect
export default async function (event, id) {
    log.debug('shardDisconnect', { event, id });
}
