"use client";

interface CategoryBubbleProps {
  emoji: string;
  label: string;
  onClick: () => void;
  delay?: number;
  size?: "sm" | "md" | "lg";
  color?: string;
}

export function CategoryBubble({ 
  emoji, 
  label, 
  onClick, 
  delay = 0,
  size = "md",
  color = "#ffffff"
}: CategoryBubbleProps) {
  const sizes = {
    sm: "w-20 h-20",
    md: "w-28 h-28",
    lg: "w-32 h-32"
  };

  const emojiSizes = {
    sm: "text-4xl",
    md: "text-5xl",
    lg: "text-6xl"
  };

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-3 animate-fade-in-up group"
      style={{ 
        animationDelay: `${delay}s`, 
        opacity: 0, 
        animationFillMode: "forwards" 
      }}
    >
      <div 
        className={`${sizes[size]} rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] hover:scale-110 transition-all duration-300 cursor-pointer`}
        style={{ backgroundColor: color }}
      >
        <span className={emojiSizes[size]}>{emoji}</span>
      </div>
      <span className="text-white text-sm font-medium drop-shadow-md">{label}</span>
    </button>
  );
}

