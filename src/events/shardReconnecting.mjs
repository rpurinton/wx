import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for shardReconnecting
export default async function (id) {
    log.debug('shardReconnecting', { id });
}
