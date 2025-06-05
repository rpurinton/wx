// Helper methods for weather reporting and scheduled reports
import { getLatLon } from './openai.mjs';
import { getWeatherData } from './owm.mjs';
import { getReport } from './openai.mjs';
import { msToMph, msToKmh, hpaToInHg } from './convert.mjs';
import { getMsg } from '../locales.mjs';

/**
 * Resolves location and units for a weather report.
 * @param {string} location
 * @param {string} locale
 * @param {string|null} userUnits
 * @returns {Promise<{lat: number, lon: number, locationName: string, units: string}>}
 */
export async function resolveLocationAndUnits(location, locale, userUnits) {
    const [lat, lon, locationNameOrig, aiUnits] = await getLatLon(location, locale);
    const locationName = locationNameOrig || location;
    const units = userUnits || aiUnits;
    return { lat, lon, locationName, units };
}

/**
 * Fetches weather data for a given location and units.
 * @param {number} lat
 * @param {number} lon
 * @param {string} units
 * @returns {Promise<Object|null>}
 */
export async function fetchWeather(lat, lon, units) {
    return await getWeatherData(lat, lon, units);
}

/**
 * Generates a weather report string for a given weather data object.
 * @param {Object} weatherData
 * @param {string} locationName
 * @param {string} units
 * @param {string} locale
 * @returns {Promise<string|null>}
 */
export async function generateWeatherReport(weatherData, locationName, units, locale) {
    return await getReport(weatherData, locationName, units, locale);
}

/**
 * Builds a Discord embed object for a weather report.
 * @param {Object} weatherData
 * @param {string} weatherReport
 * @param {string} locationName
 * @param {string} units
 * @param {string} locale
 * @returns {Object}
 */
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
