/**
 * Minimal defensive sanitizer for WYSIWYG HTML coming from WordPress ACF
 * fields (`info` on the Additional Characteristics sections). This is
 * same-origin, admin-authored content, not arbitrary user input -- so a full
 * sanitizer library is overkill -- but it's still real external content
 * (confirmed: one real slide's `info` field currently contains a corrupted
 * paste of unrelated markup), so strip the genuinely dangerous bits rather
 * than trusting it blindly.
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, "$1=$2#$2");
}
