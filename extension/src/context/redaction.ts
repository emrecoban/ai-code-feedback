// base spec §13.2: strip likely secrets/PII before anything leaves the
// machine. Deliberately conservative -- false positives (over-redacting)
// are cheap, false negatives (leaking a real key) are not.
const PATTERNS: Array<{ regex: RegExp; replacement: string }> = [
  { regex: /sk-[a-zA-Z0-9]{16,}/g, replacement: '[redacted]' },
  { regex: /AKIA[0-9A-Z]{16}/g, replacement: '[redacted]' },
  { regex: /ghp_[a-zA-Z0-9]{20,}/g, replacement: '[redacted]' },
  { regex: /(api[_-]?key|secret|token|password)\s*[:=]\s*["']?[^\s"']{6,}["']?/gi, replacement: '$1=[redacted]' },
  { regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: '[redacted-email]' },
  { regex: /-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]+?-----END [A-Z ]+PRIVATE KEY-----/g, replacement: '[redacted-key]' },
];

export function redact(code: string): string {
  return PATTERNS.reduce((text, { regex, replacement }) => text.replace(regex, replacement), code);
}
