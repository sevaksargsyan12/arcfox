// lucide-react no longer ships brand/social icons, so these four are
// hand-authored inline SVGs instead of a dependency.
const PATHS: Record<string, string> = {
  facebook:
    "M13.5 9H15V6.5h-1.5C11.6 6.5 10.5 7.6 10.5 9.5V11H9v2.5h1.5V19H13v-5.5h1.7l.3-2.5H13v-1c0-.7.2-1 1-1z",
  instagram:
    "M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm4 5.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5ZM17 6.75a.75.75 0 1 0 .75.75.75.75 0 0 0-.75-.75Z",
  linkedin:
    "M6.5 8.5h3v10h-3v-10ZM8 4.2a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5ZM12.5 8.5h3v1.4c.5-.8 1.4-1.6 3-1.6 2.3 0 3.5 1.5 3.5 4.3v5.9h-3v-5.2c0-1.3-.5-2.1-1.7-2.1-1 0-1.6.7-1.8 1.4-.1.2-.1.5-.1.8v5.1h-3v-10Z",
  youtube:
    "M21 8.5s-.2-1.5-.8-2.1c-.7-.8-1.5-.8-1.9-.9C15.8 5.3 12 5.3 12 5.3s-3.8 0-6.3.2c-.4 0-1.2.1-1.9.9-.6.6-.8 2.1-.8 2.1S2.8 10.3 2.8 12s.2 1.5.2 1.5 0 1.5.8 2.1c.7.8 1.6.8 2 .9 1.5.1 6.2.2 6.2.2s3.8 0 6.3-.2c.4 0 1.2-.1 1.9-.9.6-.6.8-2.1.8-2.1s.2-1.7.2-3.4v-.9c0-1.7-.2-1.7-.2-1.7ZM10.2 15V9l5 3-5 3Z",
};

export function SocialIcon({ platform, size = 16 }: { platform: string; size?: number }) {
  const d = PATHS[platform];
  if (!d) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
