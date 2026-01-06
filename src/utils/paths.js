/**
 * Get the correct base URL for the application
 * In development: /
 * In production (GitHub Pages): /HARUME_Portfolio/
 */
export function getBaseUrl() {
  return import.meta.env.BASE_URL || '/';
}

/**
 * Create a path with the correct base URL
 * @param {string} path - The path to append to the base URL (should start with /)
 * @returns {string} The full path with base URL
 */
export function withBase(path) {
  const base = getBaseUrl();
  // Remove trailing slash from base and leading slash from path to avoid double slashes
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  return cleanBase + cleanPath;
}
