export function parseDurationLabel(label) {
    if (!label || typeof label !== 'string') return 0;

    let total = 0;

    const horaMatch = label.match(/(\d+)\s*hora/);
    if (horaMatch) {
        total += parseInt(horaMatch[1], 10) * 60;
    }

    const minMatch = label.match(/(\d+)\s*min/);
    if (minMatch) {
        total += parseInt(minMatch[1], 10);
    }

    return total;
}
