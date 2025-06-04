import fetch from 'node-fetch';

/**
 * Fetch weather data from OpenWeatherMap API
 * @param {number} lat
 * @param {number} lon
 * @param {string} [units] - 'F' for Fahrenheit, 'C' for Celsius, or undefined for default
 * @returns {Promise<object|null>}
 */
export async function getWeatherData(lat, lon, units) {
    const apiKey = process.env.OWM_API_KEY;
    if (!apiKey) {
        throw new Error('OWM_API_KEY is not set in environment variables');
    }
    let owmUnits = 'metric';
    if (units === 'F') owmUnits = 'imperial';
    if (units === 'C') owmUnits = 'metric';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${owmUnits}`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`OpenWeatherMap API error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        return data;
    } catch (err) {
        log.error("Error fetching weather data", { lat, lon, units, error: err.message });
        return null;
    }
}
