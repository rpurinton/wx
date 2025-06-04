import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for shardResume
export default async function (id, replayedEvents) {
    log.debug('shardResume', { id, replayedEvents });
}
