import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import log from '../log.mjs';
import OpenAI from 'openai';
import { getCurrentDirname } from '../esm-filename.mjs';

/**
 * Get latitude, longitude, and translated location name using OpenAI and locate.json prompt
 * @param {string} location
 * @param {string} locale
 * @returns {Promise<[number|null, number|null, string|null]>}
 */
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
    // TODO: Parse and return [lat, lon, locationName] from response
    return [null, null, null];
}

/**
 * Stub for getReport - resolves to a string weather report
 * @param {object} weatherData
 * @param {string} locationName
 * @returns {Promise<string|null>}
 */
export async function getReport(weatherData, locationName) {
    // TODO: Implement actual OpenAI report generation logic
    return null;
}