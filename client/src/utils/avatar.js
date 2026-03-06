/**
 * Avatar color palette — 8 vibrant colors that work in both light and dark modes.
 * Each entry has a gradient background and contrasting text color.
 */
const AVATAR_COLORS = [
    { bg: 'from-rose-500 to-pink-600', ring: 'ring-rose-200 dark:ring-rose-500/20' },
    { bg: 'from-violet-500 to-purple-600', ring: 'ring-violet-200 dark:ring-violet-500/20' },
    { bg: 'from-blue-500 to-indigo-600', ring: 'ring-blue-200 dark:ring-blue-500/20' },
    { bg: 'from-cyan-500 to-teal-600', ring: 'ring-cyan-200 dark:ring-cyan-500/20' },
    { bg: 'from-emerald-500 to-green-600', ring: 'ring-emerald-200 dark:ring-emerald-500/20' },
    { bg: 'from-amber-500 to-orange-600', ring: 'ring-amber-200 dark:ring-amber-500/20' },
    { bg: 'from-fuchsia-500 to-pink-600', ring: 'ring-fuchsia-200 dark:ring-fuchsia-500/20' },
    { bg: 'from-sky-500 to-blue-600', ring: 'ring-sky-200 dark:ring-sky-500/20' },
];

/**
 * Get a deterministic avatar color based on student ID.
 * Same student always gets the same color across page reloads.
 * 
 * @param {number|string} studentId - The student's ID
 * @returns {{ bg: string, ring: string }} Tailwind gradient classes
 */
export const getAvatarColor = (studentId) => {
    const id = typeof studentId === 'string' ? parseInt(studentId, 10) : studentId;
    const index = (id || 0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
};

/**
 * Extract initials from a Vietnamese full name.
 * Takes the first letter of the last 1-2 words.
 * Examples: "Nguyễn Văn Nam" → "VN", "Huyền" → "H", "Trần Thị Bích" → "TB"
 * 
 * @param {string} fullName - Student's full name
 * @returns {string} 1-2 uppercase initials
 */
export const getInitials = (fullName) => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }
    // Vietnamese: take initials from last 2 name parts (given name)
    const last = parts[parts.length - 1].charAt(0).toUpperCase();
    const secondLast = parts[parts.length - 2].charAt(0).toUpperCase();
    return secondLast + last;
};
