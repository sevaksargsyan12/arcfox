// lucide-react no longer ships brand/social icons, so these are
// hand-authored inline SVGs instead of a dependency.
const PATHS: Record<string, string> = {
  facebook:
    "M13.5 9H15V6.5h-1.5C11.6 6.5 10.5 7.6 10.5 9.5V11H9v2.5h1.5V19H13v-5.5h1.7l.3-2.5H13v-1c0-.7.2-1 1-1z",
  instagram:
    "M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm4 5.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5ZM17 6.75a.75.75 0 1 0 .75.75.75.75 0 0 0-.75-.75Z",
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
