import log from '../log.mjs';
import { getMsg } from '../locales.mjs';
import {
    resolveLocationAndUnits,
    fetchWeather,
    generateWeatherReport,
    buildWeatherEmbed
} from '../custom/report.mjs';

// Refactor for DI: add dependencies as the second argument with defaults
export default async function (
    interaction,
    {
        log: logDep = log,
        getMsg: getMsgDep = getMsg,
        resolveLocationAndUnits: resolveLocationAndUnitsDep = resolveLocationAndUnits,
        fetchWeather: fetchWeatherDep = fetchWeather,
        generateWeatherReport: generateWeatherReportDep = generateWeatherReport,
        buildWeatherEmbed: buildWeatherEmbedDep = buildWeatherEmbed
    } = {}
) {
    try {
        logDep.debug("Weather command interaction", interaction);
        const locale = interaction.guildLocale || interaction.locale || 'en-US';
        logDep.debug("Locales", {
            interactionLocale: interaction.locale,
            guildLocale: interaction.guildLocale,
            calculatedLocale: locale
        });
        const location = interaction.options.getString('location') || null;
        const userUnits = interaction.options.getString('units') || null;
        logDep.debug("Location", location);
        if (!location) {
            logDep.warn("No location provided for weather command");
            await interaction.reply({
                content: getMsgDep(locale, 'noLocation', 'Please provide a location.')
            });
            return;
        }

        // Initial progress embed
        const progressEmbed = {
            color: 0x808080, // gray
            description: [
                getMsgDep(locale, 'embed_getting_location', '⏳ Getting location data...'),
                getMsgDep(locale, 'embed_getting_weather', '⏳ Getting weather data...'),
                getMsgDep(locale, 'embed_generating_report', '⏳ Generating report...')
            ].join('\n')
        };
        await interaction.reply({ embeds: [progressEmbed] });

        // Step 1: Get location data
        const { lat, lon, locationName, units, timezone } = await resolveLocationAndUnitsDep(location, locale, userUnits);
        logDep.debug("Resolved timezone for report", timezone);
        let progressLines = [
            getMsgDep(locale, 'embed_getting_location_ok', '✅ Getting location data... OK!'),
            getMsgDep(locale, 'embed_getting_weather', '⏳ Getting weather data...'),
            getMsgDep(locale, 'embed_generating_report', '⏳ Generating report...')
        ];
        await interaction.editReply({ embeds: [{ color: 0x808080, description: progressLines.join('\n') }] });
        if (!lat || !lon) {
            logDep.warn("Failed to get lat/lon for location", { location, lat, lon });
            await interaction.editReply({
                content: getMsgDep(locale, 'invalidLocation', 'Invalid location provided.')
            });
            return;
        }

        // Step 2: Get weather data
        const weatherData = await fetchWeatherDep(lat, lon, units);
        progressLines[1] = getMsgDep(locale, 'embed_getting_weather_ok', '✅ Getting weather data... OK!');
        await interaction.editReply({ embeds: [{ color: 0x808080, description: progressLines.join('\n') }] });
        if (!weatherData) {
            logDep.error("Failed to get weather data", { lat, lon });
            await interaction.editReply({
                content: getMsgDep(locale, 'error', 'Failed to retrieve weather data.')
            });
            return;
        }

        // Step 3: Get weather report
        const weatherReport = await generateWeatherReportDep(weatherData, locationName, units, locale, timezone);
        progressLines[2] = getMsgDep(locale, 'embed_generating_report_ok', '✅ Generating report... OK!');
        await interaction.editReply({ embeds: [{ color: 0x808080, description: progressLines.join('\n') }] });
        if (!weatherReport) {
            logDep.error("Failed to get weather report", { locationName });
            await interaction.editReply({
                content: getMsgDep(locale, 'error', 'Failed to generate weather report.')
            });
            return;
        }

        // Final weather embed (replace progress)
        const embed = buildWeatherEmbedDep(weatherData, weatherReport, locationName, units, locale);
        await interaction.editReply({ embeds: [embed] });
    } catch (err) {
        logDep.error("Error in /weather handler", err);
        try {
            await interaction.editReply({
                content: getMsgDep('en-US', 'error', 'An error occurred while processing your request.')
            });
        } catch (e) {
            logDep.error("Failed to reply with error message", e);
        }
    }
}
