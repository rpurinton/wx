import log from '../log.mjs';
import { getMsg } from '../locales.mjs';
import { getWeatherData } from '../custom/owm.mjs';
import { getLatLon, getReport } from '../custom/openai.mjs';

// Command handler for /weather
export default async function (interaction) {
    try {
        log.debug("Weather command interaction", interaction);
        await interaction.deferReply();
        const locale = interaction.guildLocale || interaction.locale || 'en-US';
        log.debug("Locales", {
            interactionLocale: interaction.locale,
            guildLocale: interaction.guildLocale,
            calculatedLocale: locale
        });
        const location = interaction.options.getString('location') || null;
        log.debug("Location", location);
        if (!location) {
            log.warn("No location provided for weather command");
            await interaction.editReply({
                content: getMsg(locale, 'commands_weather_noLocation', 'Please provide a location.'),
                flags: 1 << 6 // Ephemeral
            });
            return;
        }
        const [lat, lon, locationNameOrig] = await getLatLon(location);
        let locationName = locationNameOrig;
        log.debug("Location result", { lat, lon, locationName });
        if (!lat || !lon) {
            log.warn("Failed to get lat/lon for location", { location, lat, lon });
            await interaction.editReply({
                content: getMsg(locale, 'commands_weather_invalidLocation', 'Invalid location provided.'),
                flags: 1 << 6 // Ephemeral
            });
            return;
        }
        if (!locationName) {
            log.warn("No location name found, using input as fallback", { locationName });
            locationName = location;
        }
        // get weather data from openweathermap (set OWM_API_KEY in .env)
        const weatherData = await getWeatherData(lat, lon);
        log.debug("Weather data", weatherData);
        if (!weatherData) {
            log.error("Failed to get weather data", { lat, lon });
            await interaction.editReply({
                content: getMsg(locale, 'commands_weather_error', 'Failed to retrieve weather data.'),
                flags: 1 << 6 // Ephemeral
            });
            return;
        }
        // get weather report from openai
        const weatherReport = await getReport(weatherData, locationName);
        log.debug("Weather report", weatherReport);
        if (!weatherReport) {
            log.error("Failed to get weather report", { locationName });
            await interaction.editReply({
                content: getMsg(locale, 'commands_weather_error', 'Failed to generate weather report.'),
                flags: 1 << 6 // Ephemeral
            });
            return;
        }
        // reply with the response
        await interaction.editReply({ content: weatherReport });
    } catch (err) {
        log.error("Error in /weather handler", {
            errorMessage: err && err.message,
            errorStack: err && err.stack,
            errorObj: err
        });
        try {
            await interaction.editReply({
                content: getMsg('en-US', 'commands_weather_error', 'An error occurred while processing your request.'),
                flags: 1 << 6 // Ephemeral
            });
        } catch (e) {
            log.error("Failed to reply with error message", {
                errorMessage: e && e.message,
                errorStack: e && e.stack,
                errorObj: e
            });
        }
    }
}
