// Capitalize the first letter of a string
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Format a date as 'DD/MM/YYYY'
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-GB');
}

// Validate email address
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Format price with commas and currency
export function formatPrice(amount, currency = '$') {
  if (isNaN(amount)) return '';
  return `${currency}${Number(amount).toLocaleString()}`;
}

// Truncate text to a certain length
export function truncate(text, maxLength = 100) {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}