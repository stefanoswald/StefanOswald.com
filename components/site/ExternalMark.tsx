/** A small arrow that tells people a link opens another site. */
export function ExternalMark({ className = "h-[0.7em] w-[0.7em]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M4 2.5h5.5V8M9.25 2.75 2.5 9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Screen-reader text that goes with ExternalMark. */
export function NewTabNote() {
  return <span className="sr-only"> (opens in a new tab)</span>;
}
