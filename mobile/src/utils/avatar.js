/**
 * DiceBear Avatar Utility
 * Generates avatar URLs using the DiceBear API v9.x
 * https://www.dicebear.com/
 */

/**
 * Available DiceBear avatar styles
 */
export const AVATAR_STYLES = {
    ADVENTURER: 'adventurer',
    ADVENTURER_NEUTRAL: 'adventurer-neutral',
    AVATAAARS: 'avataaars',
    AVATAAARS_NEUTRAL: 'avataaars-neutral',
    BIG_EARS: 'big-ears',
    BIG_EARS_NEUTRAL: 'big-ears-neutral',
    BIG_SMILE: 'big-smile',
    BOTTTS: 'bottts',
    BOTTTS_NEUTRAL: 'bottts-neutral',
    CROODLES: 'croodles',
    CROODLES_NEUTRAL: 'croodles-neutral',
    FUN_EMOJI: 'fun-emoji',
    ICONS: 'icons',
    IDENTICON: 'identicon',
    INITIALS: 'initials',
    LORELEI: 'lorelei',
    LORELEI_NEUTRAL: 'lorelei-neutral',
    MICAH: 'micah',
    MINIAVS: 'miniavs',
    NOTIONISTS: 'notionists',
    NOTIONISTS_NEUTRAL: 'notionists-neutral',
    OPEN_PEEPS: 'open-peeps',
    PERSONAS: 'personas',
    PIXEL_ART: 'pixel-art',
    PIXEL_ART_NEUTRAL: 'pixel-art-neutral',
    RINGS: 'rings',
    SHAPES: 'shapes',
    THUMBS: 'thumbs',
};

/**
 * Generate a DiceBear avatar URL
 * @param {string} seed - Unique seed for the avatar (e.g., username, email, or random string)
 * @param {string} style - Avatar style from AVATAR_STYLES (default: 'adventurer-neutral')
 * @param {number} size - Avatar size in pixels (default: 200)
 * @returns {string} Avatar URL
 */
export const getDiceBearAvatar = (seed, style = AVATAR_STYLES.ADVENTURER_NEUTRAL, size = 200) => {
    if (!seed) {
        // Generate random seed if none provided
        seed = Math.random().toString(36).substring(2, 15);
    }

    return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}&size=${size}`;
};

/**
 * Generate a random avatar seed
 * @returns {string} Random seed string
 */
export const generateRandomSeed = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Get avatar URL from user data
 * @param {object} user - User object with avatarSeed property
 * @param {string} style - Avatar style (optional)
 * @param {number} size - Avatar size (optional)
 * @returns {string} Avatar URL
 */
export const getUserAvatar = (user, style = AVATAR_STYLES.ADVENTURER_NEUTRAL, size = 200) => {
    const seed = user?.avatarSeed || user?.email || user?.name || generateRandomSeed();
    return getDiceBearAvatar(seed, style, size);
};
