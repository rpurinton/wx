import fetch from 'node-fetch';

/**
 * Fetch weather data from OpenWeatherMap API, including current and next 24h forecast
 * @param {number} lat
 * @param {number} lon
 * @param {string} [units] - 'F' for Fahrenheit, 'C' for Celsius, or undefined for default
 * @returns {Promise<object|null>} Weather data object with current and 24h forecast
 */
export async function getWeatherData(lat, lon, units) {
    const apiKey = process.env.OWM_API_KEY;
    if (!apiKey) {
        throw new Error('OWM_API_KEY is not set in environment variables');
    }
    let owmUnits = 'metric';
    if (units === 'F') owmUnits = 'imperial';
    if (units === 'C') owmUnits = 'metric';
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${owmUnits}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${owmUnits}`;
    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);
        if (!currentRes.ok) {
            throw new Error(`OpenWeatherMap API error: ${currentRes.status} ${currentRes.statusText}`);
        }
        if (!forecastRes.ok) {
            throw new Error(`OpenWeatherMap API error: ${forecastRes.status} ${forecastRes.statusText}`);
        }
        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();
        // Get forecast for next 24 hours (3-hour intervals, 8 items)
        const now = Date.now() / 1000;
        const next24h = forecastData.list.filter(item => item.dt > now && item.dt <= now + 24 * 3600);
        currentData.forecast_24h = next24h;
        return currentData;
    } catch (err) {
        log.error("Error fetching weather data", { lat, lon, units, error: err.message });
        return null;
    }
}
