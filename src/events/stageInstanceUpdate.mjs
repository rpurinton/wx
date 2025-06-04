import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for stageInstanceUpdate
export default async function (oldStageInstance, newStageInstance) {
    log.debug('stageInstanceUpdate', { oldStageInstance, newStageInstance });
}
