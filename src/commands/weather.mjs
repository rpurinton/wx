import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Command handler for /help
export default async function (interaction) {
    log.debug("Weather command interaction", interaction);
    await interaction.deferReply();
    const locale = interaction.guildLocale || interaction.locale || 'en-US';
    log.info("Locales", {
        interactionLocale: interaction.locale,
        guildLocale: interaction.guildLocale,
        calculatedLocale: locale
    });
    // lookup location lat/lon with openai
    // get weather data from openweathermap
    // send weather data to openai to generate a response
    // reply with the response
}
