// src/utils/validators.js

export function isValidEmail(email = "") {
  if (!email) return false;
  // simple RFC-ish email regex (sufficient for form validation)
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function isValidPassword(pw = "") {
  // require minimum 6 chars for project; adjust as needed
  return typeof pw === "string" && pw.length >= 6;
}

export function isValidName(name = "") {
  return typeof name === "string" && name.trim().length >= 2;
}
/**
 * passwordStrength returns an integer 0..4
 * scoring based on length, variety, and special chars
 */
export function passwordStrength(pw = "") {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0..4
}