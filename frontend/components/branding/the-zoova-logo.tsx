import { cn } from "@/lib/utils";

/** Same mark + wordmark as zoova-landing/components/Logo.tsx */
export function TheZoovaLogo({
  className = "",
  markOnly = false,
  wordmarkClassName,
  markSize = 30,
}: {
  className?: string;
  markOnly?: boolean;
  wordmarkClassName?: string;
  markSize?: number;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="44" height="44" rx="12" fill="#2A2118" />
        <path
          d="M14 16 H34 L16 32 H36"
          stroke="#F4B400"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {!markOnly && (
        <span
          className={cn(
            "font-display text-xl font-semibold tracking-tight",
            wordmarkClassName ?? "text-ink"
          )}
        >
          TheZoova
        </span>
      )}
    </div>
  );
}
