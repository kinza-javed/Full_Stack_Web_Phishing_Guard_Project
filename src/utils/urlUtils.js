// src/utils/urlUtils.js
export function isValidUrl(value) {
  if (!value || typeof value !== "string") return false;
  try {
    const maybe = value.startsWith("http") ? value : "http://" + value;
    const u = new URL(maybe);
    return !!u.hostname;
  } catch {
    return false;
  }
}

export function getHostname(value) {
  try {
    const maybe = value.startsWith("http") ? value : "http://" + value;
    return new URL(maybe).hostname.replace(/^www\./i, "");
  } catch {
    return value;
  }
}

export function scoreUrl(url) {
  const hostname = getHostname(url).toLowerCase();
  const lower = url.toLowerCase();
  let score = 100;
  const reasons = [];

  const len = url.length;
  if (len > 150) { score -= 28; reasons.push("Very long URL (common in obfuscation)"); }
  else if (len > 100) { score -= 14; reasons.push("Long URL"); }

  if (!/^https:\/\//i.test(url)) { score -= 30; reasons.push("No HTTPS — data may be intercepted"); }

  const suspWords = ["login", "verify", "account", "secure", "update", "confirm", "signin", "password", "bank"];
  const found = suspWords.filter(w => lower.includes(w));
  if (found.length) { score -= Math.min(30, found.length * 8); reasons.push("Contains suspicious keywords: " + found.slice(0,4).join(", ")); }

  const shortDomains = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "tiny.cc", "is.gd"];
  if (shortDomains.some(d => hostname.endsWith(d))) { score -= 35; reasons.push("Shortened URL (destination hidden)"); }

  if (hostname.includes("xn--")) { score -= 25; reasons.push("Punycode / IDN (possible homograph attack)"); }

  if (url.includes("@")) { score -= 20; reasons.push("Contains @ (credentials/obscure redirect)"); }

  const qCount = (url.match(/\?/g) || []).length;
  if (qCount > 2) { score -= 6; reasons.push("Many query parameters (suspicious)"); }

  const segs = hostname.split(".");
  if (segs.length >= 4) { score -= 10; reasons.push("Multiple subdomains (possible cloaking)"); }

  if (/^[0-9-]/.test(hostname)) { score -= 10; reasons.push("Unusual domain start"); }

  score = Math.max(0, Math.min(100, score));
  const label = score < 40 ? "High" : score < 70 ? "Medium" : "Safe";

  return { score, label, reasons };
}

export function detectType(url) {
  const lower = url.toLowerCase();
  const types = [];
  if (/(bank|onlinebank|banking|securebank)/.test(lower)) types.push("Banking");
  if (/(login|signin|sign-in)/.test(lower)) types.push("Login page");
  if (/(reset|forgot|password)/.test(lower)) types.push("Password reset");
  if (/\/api\//.test(lower)) types.push("API endpoint");
  if (/(share|download|file)/.test(lower)) types.push("File / download");
  if (/bit\.ly|tinyurl|t\.co|goo\.gl|is\.gd/.test(lower)) types.push("Shortened URL");
  if (types.length === 0) types.push("General website");
  return types;
}

export function generateHarmReasons(url, analysis) {
  const out = [];
  if (!analysis) return [];
  if (analysis.label === "High") out.push("Likely credential theft or malware distribution.");
  else if (analysis.label === "Medium") out.push("May attempt to trick users into disclosing sensitive information.");
  else out.push("Looks mostly safe, verify certificate and origin before entering sensitive info.");

  if (!/^https:\/\//i.test(url)) out.push("No HTTPS — traffic may be intercepted.");
  if ((analysis.reasons || []).length) out.push(...analysis.reasons.slice(0,4));
  return out;
}

export function getScreenshotUrl(url) {
  const enc = encodeURIComponent(url);
  return `https://image.thum.io/get/${enc}`;
}
