/** Static silhouette shown when WebGL is unavailable or the user prefers reduced motion. */
export function DressFormFallback({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 120 200"
      className="h-full w-full"
      aria-hidden
      role="presentation"
    >
      <path
        d="M60 8 L60 22 Q68 26 72 36 Q80 50 78 66 Q90 78 86 100 Q92 118 82 130 Q88 150 70 158 L50 158 Q32 150 38 130 Q28 118 34 100 Q30 78 42 66 Q40 50 48 36 Q52 26 60 22"
        fill={color}
        opacity={0.85}
      />
      <rect x="57" y="158" width="6" height="26" fill="#2a2a2a" />
      <ellipse cx="60" cy="188" rx="26" ry="5" fill="#2a2a2a" />
    </svg>
  );
}
