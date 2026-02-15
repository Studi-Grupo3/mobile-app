// src/utils/date.js

export function toISOStringDateTime(date, timeStr) {
    const [h, m] = timeStr.split(':').map(x => parseInt(x, 10));
    const dt = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        h,
        m
    );
    return dt.toISOString();
}

export function parseDurationToMinutes(str) {
    if (!str || typeof str !== 'string') return 0;
    let hours = 0;
    let minutes = 0;

    const horaMatch = str.match(/(\d+)\s*hora(?:s)?/i);
    if (horaMatch) {
        hours = parseInt(horaMatch[1], 10);
    }

    const minMatch = str.match(/(\d+)\s*min(?:uto)?s?/i);
    if (minMatch) {
        minutes = parseInt(minMatch[1], 10);
    }

    return hours * 60 + minutes;
}
