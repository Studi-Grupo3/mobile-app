// Polyfill toReversed if missing (fix for strange environment issues)
if (!Array.prototype.toReversed) {
    Array.prototype.toReversed = function () {
        return [...this].reverse();
    };
}

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
