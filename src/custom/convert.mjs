// src/custom/convert.mjs

/**
 * Convert wind speed from meters per second to miles per hour
 * @param {number} ms - wind speed in m/s
 * @returns {number} wind speed in mph
 */
export function msToMph(ms) {
    return ms * 2.23694;
}

/**
 * Convert wind speed from meters per second to kilometers per hour
 * @param {number} ms - wind speed in m/s
 * @returns {number} wind speed in km/h
 */
export function msToKmh(ms) {
    return ms * 3.6;
}
