"use client";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { icon: 32, text: "text-xl" },
    md: { icon: 48, text: "text-3xl" },
    lg: { icon: 64, text: "text-5xl" },
  };

  const { icon, text } = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <div className="relative animate-float">
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="32" cy="32" r="30" fill="oklch(0.65 0.18 145)" fillOpacity="0.15" />
          <path
            d="M32 14C28 14 25 17 25 21C25 24 27 26 29 27L24 38C23 40 24 42 26 43H38C40 42 41 40 40 38L35 27C37 26 39 24 39 21C39 17 36 14 32 14Z"
            fill="oklch(0.65 0.18 145)"
          />
          <circle cx="22" cy="28" r="4" fill="oklch(0.65 0.18 145)" fillOpacity="0.7" />
          <circle cx="42" cy="28" r="4" fill="oklch(0.65 0.18 145)" fillOpacity="0.7" />
          <path
            d="M16 34L20 42"
            stroke="oklch(0.65 0.18 145)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeOpacity="0.7"
          />
          <path
            d="M48 34L44 42"
            stroke="oklch(0.65 0.18 145)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeOpacity="0.7"
          />
          <circle cx="32" cy="50" r="3" fill="oklch(0.75 0.15 80)" />
        </svg>
      </div>
      <div>
        <h1 className={`${text} font-bold text-foreground leading-none`}>
          Mãozinhas
        </h1>
        <p className="text-muted-foreground text-sm">Seu Concierge Digital</p>
      </div>
    </div>
  );
}
