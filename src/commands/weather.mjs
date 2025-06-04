import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Command handler for /help
export default async function (interaction) {
    interaction.deferReply();
    const locale = interaction.guild ? interaction.guild.locale : interaction.locale || 'en-US';
    log.info("Locales", {
        interactionLocale: interaction.locale,
        guildLocale: interaction.guild ? interaction.guild.locale : null,
        calculatedLocale: locale
    });
    // lookup location lat/lon with openai
    // get weather data from openweathermap
    // send weather data to openai to generate a response
    // reply with the response
}
