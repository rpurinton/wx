import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for userUpdate
export default async function (oldUser, newUser) {
    log.debug('userUpdate', { oldUser, newUser });
}
