import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for shardError
export default async function (error, shardId) {
    log.debug('shardError', { error, shardId });
}
