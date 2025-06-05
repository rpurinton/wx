import log from '../log.mjs';
import { getMsg } from '../locales.mjs';
import { resolveLocationAndUnits, fetchWeather, generateWeatherReport, buildWeatherEmbed } from '../custom/report.mjs';

// Command handler for /weather
export default async function (interaction) {
    try {
        log.debug("Weather command interaction", interaction);
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
            await interaction.reply({
                content: getMsg(locale, 'noLocation', 'Please provide a location.')
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
        await interaction.reply({ embeds: [progressEmbed] });

        // Step 1: Get location data
        const { lat, lon, locationName, units } = await resolveLocationAndUnits(location, locale, userUnits);
        let progressLines = [
            getMsg(locale, 'embed_getting_location_ok', '✅ Getting location data... OK!'),
            getMsg(locale, 'embed_getting_weather', '⏳ Getting weather data...'),
            getMsg(locale, 'embed_generating_report', '⏳ Generating report...')
        ];
        await interaction.editReply({ embeds: [{ color: 0x808080, description: progressLines.join('\n') }] });
        if (!lat || !lon) {
            log.warn("Failed to get lat/lon for location", { location, lat, lon });
            await interaction.editReply({
                content: getMsg(locale, 'invalidLocation', 'Invalid location provided.')
            });
            return;
        }

        // Step 2: Get weather data
        const weatherData = await fetchWeather(lat, lon, units);
        progressLines[1] = getMsg(locale, 'embed_getting_weather_ok', '✅ Getting weather data... OK!');
        await interaction.editReply({ embeds: [{ color: 0x808080, description: progressLines.join('\n') }] });
        if (!weatherData) {
            log.error("Failed to get weather data", { lat, lon });
            await interaction.editReply({
                content: getMsg(locale, 'error', 'Failed to retrieve weather data.')
            });
            return;
        }

        // Step 3: Get weather report
        const weatherReport = await generateWeatherReport(weatherData, locationName, units, locale);
        progressLines[2] = getMsg(locale, 'embed_generating_report_ok', '✅ Generating report... OK!');
        await interaction.editReply({ embeds: [{ color: 0x808080, description: progressLines.join('\n') }] });
        if (!weatherReport) {
            log.error("Failed to get weather report", { locationName });
            await interaction.editReply({
                content: getMsg(locale, 'error', 'Failed to generate weather report.')
            });
            return;
        }

        // Final weather embed (replace progress)
        const embed = buildWeatherEmbed(weatherData, weatherReport, locationName, units, locale);
        await interaction.editReply({ embeds: [embed] });
    } catch (err) {
        log.error("Error in /weather handler", err);
        try {
            await interaction.editReply({
                content: getMsg('en-US', 'error', 'An error occurred while processing your request.')
            });
        } catch (e) {
            log.error("Failed to reply with error message", e);
        }
    }
}
