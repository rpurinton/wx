import log from '../log.mjs';
import { getMsg } from '../locales.mjs';
import { getWeatherData } from '../custom/owm.mjs';
import { getLatLon, getReport } from '../custom/openai.mjs';
import { msToMph, msToKmh } from '../custom/convert.mjs';

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
        const userUnits = interaction.options.getString('units') || null;
        log.debug("Location", location);
        if (!location) {
            log.warn("No location provided for weather command");
            await interaction.editReply({
                content: getMsg(locale, 'commands_weather_noLocation', 'Please provide a location.'),
                flags: 1 << 6 // Ephemeral
            });
            return;
        }
        const [lat, lon, locationNameOrig, aiUnits] = await getLatLon(location, locale);
        let locationName = locationNameOrig;
        let units = userUnits || aiUnits;
        log.debug("Location result", { lat, lon, locationName, units });
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
        const weatherData = await getWeatherData(lat, lon, units);
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
        const weatherReport = await getReport(weatherData, locationName, units, locale);
        log.debug("Weather report", weatherReport);
        if (!weatherReport) {
            log.error("Failed to get weather report", { locationName });
            await interaction.editReply({
                content: getMsg(locale, 'commands_weather_error', 'Failed to generate weather report.'),
                flags: 1 << 6 // Ephemeral
            });
            return;
        }
        // reply with a Discord embed
        let windValue = getMsg(locale, 'commands_weather_embed_na', 'N/A');
        if (weatherData.wind && weatherData.wind.speed !== undefined) {
            if (units === 'F') {
                windValue = `${msToMph(weatherData.wind.speed).toFixed(1)} mph`;
            } else if (units === 'C') {
                windValue = `${msToKmh(weatherData.wind.speed).toFixed(1)} km/h`;
            } else {
                windValue = `${weatherData.wind.speed} m/s`;
            }
        }
        const weatherIcon = weatherData.weather && weatherData.weather[0] && weatherData.weather[0].icon
            ? `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
            : null;
        const embed = {
            title: getMsg(locale, 'commands_weather_embed_title', `Weather Report for ${locationName}`)
                .replace('{location}', locationName),
            color: 0x808080, // gray
            description: weatherReport,
            fields: [
                {
                    name: getMsg(locale, 'commands_weather_embed_temp', 'Temperature'),
                    value: `${weatherData.main.temp}°${units}`,
                    inline: true
                },
                {
                    name: getMsg(locale, 'commands_weather_embed_feelslike', 'Feels Like'),
                    value: `${weatherData.main.feels_like}°${units}`,
                    inline: true
                },
                {
                    name: getMsg(locale, 'commands_weather_embed_humidity', 'Humidity'),
                    value: `${weatherData.main.humidity}%`,
                    inline: true
                },
                {
                    name: getMsg(locale, 'commands_weather_embed_condition', 'Condition'),
                    value: weatherData.weather && weatherData.weather[0] && weatherData.weather[0].description
                        ? weatherData.weather[0].description
                        : getMsg(locale, 'commands_weather_embed_na', 'N/A'),
                    inline: true
                },
                {
                    name: getMsg(locale, 'commands_weather_embed_wind', 'Wind'),
                    value: windValue,
                    inline: true
                }
            ],
            thumbnail: weatherIcon ? { url: weatherIcon } : undefined
        };
        await interaction.editReply({ embeds: [embed] });
    } catch (err) {
        log.error("Error in /weather handler", err);
        try {
            await interaction.editReply({
                content: getMsg('en-US', 'commands_weather_error', 'An error occurred while processing your request.'),
                flags: 1 << 6 // Ephemeral
            });
        } catch (e) {
            log.error("Failed to reply with error message", e);
        }
    }
}
