import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for applicationCommandUpdate
export default async function (...args) {
    log.debug("applicationCommandUpdate", { args });
}
