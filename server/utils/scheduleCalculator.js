/**
 * Schedule-based date calculator.
 * Calculates end_date by counting actual class sessions based on schedule days.
 * 
 * @param {string} startDate - ISO date string (YYYY-MM-DD)
 * @param {number} totalSessions - Total number of sessions
 * @param {string} scheduleDays - Comma-separated days like "T2,T4,T6"
 * @returns {string} end_date as ISO string
 */

// Map T2-CN to JavaScript getDay() values (0=Sun, 1=Mon...)
const DAY_MAP = {
    'T2': 1, 'T3': 2, 'T4': 3, 'T5': 4, 'T6': 5, 'T7': 6, 'CN': 0
};

function parseDays(scheduleDays) {
    if (!scheduleDays) return [];
    return scheduleDays.split(/[,\-|;\s]+/)
        .map(d => d.trim().toUpperCase())
        .filter(d => DAY_MAP[d] !== undefined)
        .map(d => DAY_MAP[d]);
}

/**
 * Calculate end date by counting forward through actual class days.
 */
function calculateEndDate(startDateStr, totalSessions, scheduleDays) {
    const classDays = parseDays(scheduleDays);

    // Fallback: if no schedule days, use simple week calculation
    if (classDays.length === 0 || totalSessions <= 0) {
        const start = new Date(startDateStr);
        const weeksNeeded = Math.ceil(totalSessions / 3); // default 3 sessions/week
        start.setDate(start.getDate() + weeksNeeded * 7);
        return start.toISOString().slice(0, 10);
    }

    let count = 0;
    const current = new Date(startDateStr);
    current.setHours(0, 0, 0, 0);

    // Safety limit to prevent infinite loop (max 14 days delay between sessions)
    const maxDays = totalSessions * 14;
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

/**
 * Calculate remaining sessions from a given date to end_date based on schedule.
 */
function calculateRemainingSessions(fromDateStr, endDateStr, scheduleDays) {
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

module.exports = { calculateEndDate, calculateRemainingSessions, parseDays };
