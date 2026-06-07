/**
 * Security utilities for input sanitization and validation.
 * Prevents XSS, injection attacks, and malformed data.
 */

// Strip HTML tags from user input
export function sanitizeText(input) {
  if (typeof input !== "string") return "";
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Validate and sanitize a URL (only allow http/https)
export function sanitizeUrl(url) {
  if (typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#") return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }
    return "";
  } catch {
    return "";
  }
}

// Validate email format
export function isValidEmail(email) {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Sanitize an entire object's string values recursively
export function sanitizeObject(obj) {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);

  const sanitized = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === "string") {
      // URL fields get URL sanitization
      if (key.toLowerCase().includes("url") || key.toLowerCase().includes("link") || key === "live" || key === "github") {
        sanitized[key] = sanitizeUrl(val);
      } else if (key.toLowerCase().includes("email")) {
        sanitized[key] = val.trim();
      } else {
        sanitized[key] = sanitizeText(val);
      }
    } else if (typeof val === "object") {
      sanitized[key] = sanitizeObject(val);
    } else {
      sanitized[key] = val;
    }
  }
  return sanitized;
}

// Rate limiter for form submissions
const rateLimitMap = new Map();

export function checkRateLimit(action, maxPerMinute = 10) {
  const now = Date.now();
  const key = action;
  const entries = rateLimitMap.get(key) || [];
  const recent = entries.filter((t) => now - t < 60000);
  if (recent.length >= maxPerMinute) {
    return false;
  }
  recent.push(now);
  rateLimitMap.set(key, recent);
  return true;
}
