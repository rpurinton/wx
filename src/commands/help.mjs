import log from "../log.mjs";
import { getMsg } from "../locales.mjs";

// Refactor for DI: add dependencies as the second argument
export default async function (interaction, { logDep = log, getMsgDep = getMsg } = {}) {
    try {
        const helpContent = getMsgDep(interaction.locale, "help", "No help available for this command.");
        await interaction.reply({
            content: helpContent,
            flags: 1 << 6, // EPHEMERAL
        });
    } catch (err) {
        try {
            logDep.error("Error in /help handler", err);
            const msgContent = getMsgDep(interaction.locale, "error", "An error occurred while processing your request.");
            await interaction.reply({
                content: msgContent,
                flags: 1 << 6,
            });
        } catch (e) {
            logDep.error("Failed to reply with error message", e);
        }
    }
}