import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for interactionCreate
export default async function (interaction) {
    log.debug('createInteraction', {
        commandName: interaction.commandName,
        userId: interaction.user.id,
        guildId: interaction.guildId,
    });
    const handler = global.commands[interaction.commandName];
    if (handler) {
        await handler(interaction);
    }
}
