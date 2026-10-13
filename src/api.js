// Central API base URL configuration.
// Set VITE_API_BASE_URL in your .env file (e.g. VITE_API_BASE_URL=http://localhost:5000).
// Falls back to localhost:5000 in development if the env var is not set.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default API_BASE_URL;
