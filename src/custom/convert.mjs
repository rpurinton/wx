// src/custom/convert.mjs

// Refactor to a factory for testability (no dependencies needed)
export function createConvertHelpers() {
    return {
        /**
         * Convert wind speed from meters per second to miles per hour
         * @param {number} ms - wind speed in m/s
         * @returns {number} wind speed in mph
         */
        msToMph(ms) {
            return ms * 2.23694;
        },

        /**
         * Convert wind speed from meters per second to kilometers per hour
         * @param {number} ms - wind speed in m/s
         * @returns {number} wind speed in km/h
         */
        msToKmh(ms) {
            return ms * 3.6;
        },

        /**
         * Convert pressure from hPa to inHg (inches of mercury)
         * @param {number} hpa - pressure in hectopascals
         * @returns {number} pressure in inHg
         */
        hpaToInHg(hpa) {
            return hpa * 0.02953;
        }
    };
}

// Export hpaToInHg as a named export for compatibility with consumers and tests
export function hpaToInHg(hpa) {
    return hpa * 0.02953;
}

// Export msToKmh as a named export for compatibility with consumers and tests
export function msToKmh(ms) {
    return ms * 3.6;
}

// Export msToMph as a named export for compatibility with consumers and tests
export function msToMph(ms) {
    return ms * 2.23694;
}
