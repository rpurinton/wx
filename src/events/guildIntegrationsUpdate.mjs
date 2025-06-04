import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for guildIntegrationsUpdate
export default async function (guild) {
    log.debug('guildIntegrationsUpdate', { guild });
}
