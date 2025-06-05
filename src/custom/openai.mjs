import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import log from '../log.mjs';
import OpenAI from 'openai';
import { getCurrentDirname } from '../esm-filename.mjs';

/**
 * Create OpenAI helpers for getting location and weather report
 * @param {object} dependencies - The dependencies
 * @param {function} dependencies.fs - File system module
 * @param {function} dependencies.path - Path module
 * @param {function} dependencies.log - Log module
 * @param {function} dependencies.OpenAI - OpenAI module
 * @param {function} dependencies.getCurrentDirname - Function to get current dirname
 * @returns {object} The OpenAI helpers
 */
export function createOpenaiHelpers({ fs, path, log, OpenAI, getCurrentDirname }) {
    return {
        /**
         * Get latitude, longitude, and translated location name using OpenAI and locate.json prompt
         * @param {string} location
         * @param {string} locale
         * @returns {Promise<[number|null, number|null, string|null, string|null]>}
         */
        async getLatLon(location, locale) {
            const dirname = getCurrentDirname(import.meta);
            const locatePath = path.join(dirname, 'locate.json');
            const locateConfig = JSON.parse(fs.readFileSync(locatePath, 'utf8'));
            locateConfig.messages[0].content[0].text = locateConfig.messages[0].content[0].text
                .replace('{user_input}', location)
                .replace('{locale}', locale);
            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) throw new Error('OPENAI_API_KEY not set');
            const openai = new OpenAI({ apiKey });

            const response = await openai.chat.completions.create(locateConfig);
            log.debug('OpenAI locate response', response);
            // Parse and return [lat, lon, locationName] from response
            try {
                const toolCalls = response.choices?.[0]?.message?.tool_calls;
                if (toolCalls && toolCalls.length > 0) {
                    const tool = toolCalls.find(tc => tc.type === 'function' && tc.function.name === 'getLatLon');
                    if (tool) {
                        const args = JSON.parse(tool.function.arguments);
                        return [args.lat, args.lon, args.location_name, args.units];
                    }
                }
            } catch (err) {
                log.error('Failed to parse OpenAI tool call response', err);
            }
            return [null, null, null, null];
        },

        /**
         * Generate a TV style weather report using OpenAI and report.json prompt
         * @param {object} weatherData - The weather data object from OpenWeatherMap
         * @param {string} locationName - The name of the location
         * @param {string} units - 'F' for Fahrenheit, 'C' for Celsius, or undefined for default
         * @param {string} locale - The locale for the report (e.g., 'en-US')
         * @returns {Promise<string|null>}
         */
        async getReport(weatherData, locationName, units, locale) {
            const dirname = getCurrentDirname(import.meta);
            const reportPath = path.join(dirname, 'report.json');
            const reportConfig = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
            const timeString = new Date().toLocaleString(locale, { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            reportConfig.messages[0].content[0].text = reportConfig.messages[0].content[0].text
                .replace('{weather_data}', JSON.stringify(weatherData))
                .replace('{location_name}', locationName)
                .replace('{units}', units)
                .replace('{locale}', locale)
                .replace('{time_string}', timeString);
            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) throw new Error('OPENAI_API_KEY not set');
            const openai = new OpenAI({ apiKey });

            const response = await openai.chat.completions.create(reportConfig);
            log.debug('OpenAI report response', response);
            try {
                const text = response.choices?.[0]?.message?.content;
                if (text) return text;
            } catch (err) {
                log.error('Failed to parse OpenAI report response', err);
            }
            return null;
        }
    };
}

// Export getLatLon as a named export for compatibility with consumers and tests
export async function getLatLon(location, locale) {
    const dirname = getCurrentDirname(import.meta);
    const locatePath = path.join(dirname, 'locate.json');
    const locateConfig = JSON.parse(fs.readFileSync(locatePath, 'utf8'));
    locateConfig.messages[0].content[0].text = locateConfig.messages[0].content[0].text
        .replace('{user_input}', location)
        .replace('{locale}', locale);
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY not set');
    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create(locateConfig);
    log.debug('OpenAI locate response', response);
    // Parse and return [lat, lon, locationName] from response
    try {
        const toolCalls = response.choices?.[0]?.message?.tool_calls;
        if (toolCalls && toolCalls.length > 0) {
            const tool = toolCalls.find(tc => tc.type === 'function' && tc.function.name === 'getLatLon');
            if (tool) {
                const args = JSON.parse(tool.function.arguments);
                return [args.lat, args.lon, args.location_name, args.units];
            }
        }
    } catch (err) {
        log.error('Failed to parse OpenAI tool call response', err);
    }
    return [null, null, null, null];
}

// Export getReport as a named export for compatibility
export async function getReport(weatherData, locationName, units, locale) {
    const dirname = getCurrentDirname(import.meta);
    const reportPath = path.join(dirname, 'report.json');
    const reportConfig = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    reportConfig.messages[0].content[0].text = reportConfig.messages[0].content[0].text
        .replace('{weather_data}', JSON.stringify(weatherData))
        .replace('{location_name}', locationName)
        .replace('{units}', units)
        .replace('{locale}', locale);
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY not set');
    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create(reportConfig);
    log.debug('OpenAI report response', response);
    try {
        const text = response.choices?.[0]?.message?.content;
        if (text) return text;
    } catch (err) {
        log.error('Failed to parse OpenAI report response', err);
    }
    return null;
}