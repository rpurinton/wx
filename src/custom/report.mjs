// Helper methods for weather reporting and scheduled reports
import { saveLatLon } from './openai.mjs';
import { getWeatherData } from './owm.mjs';
import { getReport } from './openai.mjs';
import { msToMph, msToKmh, hpaToInHg } from './convert.mjs';
import { getMsg } from '../locales.mjs';
import log from '../log.mjs';

/**
 * Creates report helpers with injected dependencies for testability.
 * @param {{saveLatLon: function, getWeatherData: function, getReport: function, msToMph: function, msToKmh: function, hpaToInHg: function, getMsg: function}} dependencies
 * @returns {{resolveLocationAndUnits: function, fetchWeather: function, generateWeatherReport: function, buildWeatherEmbed: function}}
 */
export function createReportHelpers({
    saveLatLon,
    getWeatherData,
    getReport,
    msToMph,
    msToKmh,
    hpaToInHg,
    getMsg,
    log: injectedLog
}) {
    const logger = injectedLog || log;
    return {
        /**
         * Resolves location and units for a weather report.
         * @param {string} location
         * @param {string} locale
         * @param {string|null} userUnits
         * @returns {Promise<{lat: number, lon: number, locationName: string, units: string}>}
         */
        async resolveLocationAndUnits(location, locale, userUnits) {
            const [lat, lon, locationNameOrig, aiUnits, timezone] = await saveLatLon(location, locale);
            logger.debug && logger.debug('AI returned timezone:', timezone);
            const locationName = locationNameOrig || location;
            const units = userUnits || aiUnits;
            return { lat, lon, locationName, units, timezone };
        },

        /**
         * Fetches weather data for a given location and units.
         * @param {number} lat
         * @param {number} lon
         * @param {string} units
         * @returns {Promise<Object|null>}
         */
        async fetchWeather(lat, lon, units) {
            return await getWeatherData(lat, lon, units);
        },

        /**
         * Generates a weather report string for a given weather data object.
         * @param {Object} weatherData
         * @param {string} locationName
         * @param {string} units
         * @param {string} locale
         * @returns {Promise<string|null>}
         */
        async generateWeatherReport(weatherData, locationName, units, locale, timezone) {
            const report = await getReport(weatherData, locationName, units, locale, timezone);
            if (logger.debug) {
                let timeString;
                try {
                    timeString = new Date().toLocaleString(locale, { timeZone: timezone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                } catch (e) {
                    timeString = new Date().toLocaleString(locale, { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                }
                logger.debug('Calculated time string for report:', timeString);
            }
            return report;
        },

        /**
         * Builds a Discord embed object for a weather report.
         * @param {Object} weatherData
         * @param {string} weatherReport
         * @param {string} locationName
         * @param {string} units
         * @param {string} locale
         * @returns {Object}
         */
        buildWeatherEmbed(weatherData, weatherReport, locationName, units, locale) {
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
            return {
                title: getMsg(locale, 'embed_title', `Weather Report for ${locationName}`).replace('{location}', locationName),
                color: 0x808080,
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
        }
    };
}

// Export fetchWeather as a named export for compatibility with consumers and tests
export async function fetchWeather(lat, lon, units) {
    return await getWeatherData(lat, lon, units);
}

// Export buildWeatherEmbed as a named export for compatibility with consumers and tests
export function buildWeatherEmbed(weatherData, weatherReport, locationName, units, locale) {
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
    return {
        title: getMsg(locale, 'embed_title', `Weather Report for ${locationName}`).replace('{location}', locationName),
        color: 0x808080,
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
}

// Export resolveLocationAndUnits as a named export for compatibility with consumers and tests
export async function resolveLocationAndUnits(location, locale, userUnits) {
    const [lat, lon, locationNameOrig, aiUnits, timezone] = await saveLatLon(location, locale);
    log.debug && log.debug('AI returned timezone:', timezone);
    const locationName = locationNameOrig || location;
    const units = userUnits || aiUnits;
    return { lat, lon, locationName, units, timezone };
}

// Export generateWeatherReport as a named export for compatibility
export async function generateWeatherReport(weatherData, locationName, units, locale, timezone) {
    const report = await getReport(weatherData, locationName, units, locale, timezone);
    if (log.debug) {
        let timeString;
        try {
            timeString = new Date().toLocaleString(locale, { timeZone: timezone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            timeString = new Date().toLocaleString(locale, { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
        log.debug('Calculated time string for report:', timeString);
    }
    return report;
}
