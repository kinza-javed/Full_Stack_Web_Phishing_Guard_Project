// API client to communicate with backend server

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get user ID from localStorage
function getUserId() {
  try {
    const raw = localStorage.getItem('pg_user');
    if (!raw) return 'guest';
    const parsed = JSON.parse(raw);
    return parsed.user?.id || 'guest';
  } catch {
    return 'guest';
  }
}

// Helper function to get headers with user ID
function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-user-id': getUserId()
  };
}

// Save scan to database
export async function saveScanToDatabase(scanData) {
  try {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/scans`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ ...scanData, userId })
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to save scan:', error);
    return { success: false, error: error.message };
  }
}

// Get scan history from database
export async function getScanHistory(userEmail) {
  try {
    const response = await fetch(`${API_BASE_URL}/scans`, {
      headers: getHeaders()
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch scan history:', error);
    return [];
  }
}

// Delete scan from history
export async function deleteScan(scanId) {
  try {
    const response = await fetch(`${API_BASE_URL}/scans/${scanId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to delete scan:', error);
    return { success: false, error: error.message };
  }
}

// User registration
export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await response.json();
  } catch (error) {
    console.error('Registration failed:', error);
    return { success: false, error: error.message };
  }
}

// User login
export async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return await response.json();
  } catch (error) {
    console.error('Login failed:', error);
    return { success: false, error: error.message };
  }
}

// Submit contact form
export async function submitContactForm(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to submit contact form:', error);
    return { success: false, error: error.message };
  }
}

// Check server health
export async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('Server health check failed:', error);
    return { success: false, error: 'Server is not reachable' };
  }
}
