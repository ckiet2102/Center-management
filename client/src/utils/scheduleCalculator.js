/**
 * Schedule-based date calculator.
 * Used in frontend for previewing end_dates and remaining sessions.
 */

const DAY_MAP = {
    'T2': 1, 'T3': 2, 'T4': 3, 'T5': 4, 'T6': 5, 'T7': 6, 'CN': 0
};

export function parseDays(scheduleDays) {
    if (!scheduleDays) return [];
    return scheduleDays.split(/[,\-|;\s]+/)
        .map(d => d.trim().toUpperCase())
        .filter(d => DAY_MAP[d] !== undefined)
        .map(d => DAY_MAP[d]);
}

export function calculateEndDate(startDateStr, totalSessions, scheduleDays) {
    const classDays = parseDays(scheduleDays);

    if (classDays.length === 0 || totalSessions <= 0) {
        const start = new Date(startDateStr);
        const weeksNeeded = Math.ceil(totalSessions / 3);
        start.setDate(start.getDate() + weeksNeeded * 7);
        return start.toISOString().slice(0, 10);
    }

    let count = 0;
    const current = new Date(startDateStr);
    current.setHours(0, 0, 0, 0);

    const maxDays = totalSessions * 14; // Allow max 2 weeks between sessions
    let daysChecked = 0;

    while (count < totalSessions && daysChecked < maxDays) {
        const dayOfWeek = current.getDay();
        if (classDays.includes(dayOfWeek)) {
            count++;
            if (count >= totalSessions) break;
        }
        current.setDate(current.getDate() + 1);
        daysChecked++;
    }

    return current.toISOString().slice(0, 10);
}

export function calculateRemainingSessions(fromDateStr, endDateStr, scheduleDays) {
    const classDays = parseDays(scheduleDays);
    if (classDays.length === 0) return 0;

    let count = 0;
    const current = new Date(fromDateStr);
    current.setHours(0, 0, 0, 0);

    const end = new Date(endDateStr);
    end.setHours(0, 0, 0, 0);

    while (current <= end) {
        if (classDays.includes(current.getDay())) {
            count++;
        }
        current.setDate(current.getDate() + 1);
    }

    return count;
}
