import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for stageInstanceCreate
export default async function (stageInstance) {
    log.debug('stageInstanceCreate', { stageInstance });
}
