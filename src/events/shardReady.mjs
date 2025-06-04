import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for shardReady
export default async function (id, unavailableGuilds) {
    log.debug('shardReady', { id, unavailableGuilds });
}
