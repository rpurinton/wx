import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for voiceStateUpdate
export default async function (oldState, newState) {
    log.debug('voiceStateUpdate', { oldState, newState });
}
