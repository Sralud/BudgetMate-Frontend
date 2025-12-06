// Formatting utilities for currency and dates

/**
 * Format number as currency
 * Example: 1500.5 => "₱ 1,500.50"
 */
export const formatCurrency = (amount, currency = '₱') => {
    // If no amount is given, just return 0
    if (amount === null || amount === undefined) return `${currency} 0`;

    // Convert to number and add commas and decimals
    return `${currency} ${Number(amount).toLocaleString('en-PH', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
};

/**
 * Format number with commas
 * @param {number} number - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (number) => {
    if (number === null || number === undefined) return '0';
    return Number(number).toLocaleString('en-PH');
};

/**
 * Format date to readable string
 * Usage: formatDate(new Date(), 'short') => 'Dec 5, 2025'
 */
export const formatDate = (date, format = 'short') => {
    if (!date) return '';

    // Create a Date object if a string was passed
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    switch (format) {
        case 'short':
            // Example: Dec 5, 2023
            return dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        case 'long':
            // Example: Friday, December 5, 2023
            return dateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            });
        case 'full':
            return dateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
            });
        case 'time':
            // Example: 10:30 AM
            return dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            });
        default:
            return dateObj.toLocaleDateString();
    }
};

/**
 * Format percentage
 * @param {number} value - The value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
    if (value === null || value === undefined) return '0%';
    return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {Date|string} date - The date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return formatDate(dateObj, 'short');
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};
