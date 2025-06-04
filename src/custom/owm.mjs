import fetch from 'node-fetch';

/**
 * Fetch weather data from OpenWeatherMap API
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<object|null>}
 */
export async function getWeatherData(lat, lon) {
    const apiKey = process.env.OWM_API_KEY;
    if (!apiKey) {
        throw new Error('OWM_API_KEY is not set in environment variables');
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`OpenWeatherMap API error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        return data;
    } catch (err) {
        log.error("Error fetching weather data", { lat, lon, error: err.message });
        return null;
    }
}
