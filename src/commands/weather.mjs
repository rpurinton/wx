import log from '../log.mjs';
import { getMsg } from '../locales.mjs';
import { getWeatherData } from '../custom/owm.mjs';
import { getLatLon, getReport } from '../custom/openai.mjs';
import { msToMph, msToKmh, hpaToInHg } from '../custom/convert.mjs';

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
                content: getMsg(locale, 'noLocation', 'Please provide a location.'),
                flags: 1 << 6 // Ephemeral
            });
            return;
        }

        // Initial progress embed
        const progressEmbed = {
            color: 0x808080, // gray
            description: [
                getMsg(locale, 'embed_getting_location', '⏳ Getting location data...'),
                getMsg(locale, 'embed_getting_weather', '⏳ Getting weather data...'),
                getMsg(locale, 'embed_generating_report', '⏳ Generating report...')
            ].join('\n')
        };
        await interaction.reply({ embeds: [progressEmbed], flags: 1 << 6 });

        // Step 1: Get location data
        const [lat, lon, locationNameOrig, aiUnits] = await getLatLon(location, locale);
        let locationName = locationNameOrig;
        let units = userUnits || aiUnits;
        let progressLines = [
            getMsg(locale, 'embed_getting_location_ok', '✅ Getting location data... OK!'),
            getMsg(locale, 'embed_getting_weather', '⏳ Getting weather data...'),
            getMsg(locale, 'embed_generating_report', '⏳ Generating report...')
        ];
        await interaction.editReply({ embeds: [{ color: 0x808080, description: progressLines.join('\n') }] });
        if (!lat || !lon) {
            log.warn("Failed to get lat/lon for location", { location, lat, lon });
            await interaction.editReply({
                content: getMsg(locale, 'invalidLocation', 'Invalid location provided.'),
                flags: 1 << 6 // Ephemeral
            });
            return;
        }
        if (!locationName) locationName = location;

        // Step 2: Get weather data
        const weatherData = await getWeatherData(lat, lon, units);
        progressLines[1] = getMsg(locale, 'embed_getting_weather_ok', '✅ Getting weather data... OK!');
        await interaction.editReply({ embeds: [{ color: 0x808080, description: progressLines.join('\n') }] });
        if (!weatherData) {
            log.error("Failed to get weather data", { lat, lon });
            await interaction.editReply({
                content: getMsg(locale, 'error', 'Failed to retrieve weather data.'),
                flags: 1 << 6 // Ephemeral
            });
            return;
        }

        // Step 3: Get weather report
        const weatherReport = await getReport(weatherData, locationName, units, locale);
        progressLines[2] = getMsg(locale, 'embed_generating_report_ok', '✅ Generating report... OK!');
        await interaction.editReply({ embeds: [{ color: 0x808080, description: progressLines.join('\n') }] });
        if (!weatherReport) {
            log.error("Failed to get weather report", { locationName });
            await interaction.editReply({
                content: getMsg(locale, 'error', 'Failed to generate weather report.'),
                flags: 1 << 6 // Ephemeral
            });
            return;
        }

        // Final weather embed (replace progress)
        let windValue = getMsg(locale, 'embed_na', 'N/A');
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
            title: getMsg(locale, 'embed_title', `Weather Report for ${locationName}`).replace('{location}', locationName),
            color: 0x808080, // gray
            description: weatherReport,
            fields: [
                {
                    name: getMsg(locale, 'embed_temp', 'Temperature'),
                    value: `${weatherData.main.temp}°${units}`,
                    inline: true
                },
                {
                    name: getMsg(locale, 'embed_feelslike', 'Feels Like'),
                    value: `${weatherData.main.feels_like}°${units}`,
                    inline: true
                },
                {
                    name: getMsg(locale, 'embed_humidity', 'Humidity'),
                    value: `${weatherData.main.humidity}%`,
                    inline: true
                },
                {
                    name: getMsg(locale, 'embed_condition', 'Condition'),
                    value: weatherData.weather && weatherData.weather[0] && weatherData.weather[0].description
                        ? weatherData.weather[0].description
                        : getMsg(locale, 'embed_na', 'N/A'),
                    inline: true
                },
                {
                    name: getMsg(locale, 'embed_wind', 'Wind'),
                    value: windValue,
                    inline: true
                },
                {
                    name: getMsg(locale, 'embed_pressure', 'Pressure'),
                    value: weatherData.main && weatherData.main.pressure !== undefined
                        ? (units === 'F'
                            ? `${hpaToInHg(weatherData.main.pressure).toFixed(2)} inHg`
                            : `${weatherData.main.pressure} hPa`)
                        : getMsg(locale, 'embed_na', 'N/A'),
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
                content: getMsg('en-US', 'error', 'An error occurred while processing your request.'),
                flags: 1 << 6 // Ephemeral
            });
        } catch (e) {
            log.error("Failed to reply with error message", e);
        }
    }
}
