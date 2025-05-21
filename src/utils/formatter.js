/**
 * Format a number as Malaysian Ringgit currency (RM)
 * @param value - Number to format
 * @returns Formatted currency string
 */
export function formatCurrency(value) {
  return `RM${value.toFixed(2)}`;
}

/**
 * Format a date string to a more readable format
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string (e.g., "May 15, 2024")
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/**
 * Convert a number to a percentage string (e.g., 0.25 -> "25%")
 * @param value - Number to convert
 * @returns Percentage string
 */
export function formatPercentage(value) {
  return `${(value * 100).toFixed(2)}%`;
}

/**
 * Format a phone number string in the format (XXX) XXX-XXXX
 * @param phoneNumber - Phone number string (e.g., "1234567890")
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(phoneNumber) {
  return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}
