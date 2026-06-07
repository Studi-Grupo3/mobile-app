// src/utils/date.js

export function toISOStringDateTime(date, timeStr) {
    const [h, m] = timeStr.split(':').map(x => parseInt(x, 10));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(h).padStart(2, '0');
    const min = String(m).padStart(2, '0');
    return `${year}-${month}-${day}T${hour}:${min}:00`;
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

export function parseUtcDateTime(value) {
    if (!value) return null;
    if (value instanceof Date) return value;
    const raw = String(value).trim();
    if (!raw) return null;
    // Backend returns local time without timezone suffix (e.g. 2026-06-08T10:00:00)
    // Do NOT append Z — treat as local time
    const dt = new Date(raw);
    if (Number.isNaN(dt.getTime())) return null;
    return dt;
}
