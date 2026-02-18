"use client";

import { useState } from "react";
import {
  House,
  Heart,
  Scissors,
  PawPrint,
  Barbell,
  GridFour,
  GraduationCap,
  Briefcase,
  CaretRight,
} from "@phosphor-icons/react";
import { CepModal } from "./cep-modal";
import { WorkerRegistrationModal } from "./worker-registration-modal";

/* ─── Types ── */
type Category = "casa" | "cuidados" | "aulas" | "beleza" | "outros" | "esportes" | "pets";

interface OnboardingProps {
  onSearch: (category: Category, cep: string) => void;
}

const categoryLabels: Record<Category, string> = {
  casa:     "serviços de casa",
  cuidados: "serviços de cuidados",
  aulas:    "aulas",
  beleza:   "serviços de beleza",
  outros:   "outros serviços",
  esportes: "serviços de esportes",
  pets:     "serviços para pets",
};

/* ─────────────────────────────────────────────────────────────────
   HAND LAYOUT — positions as % of the 500 × 700 viewBox container
   Fingers are spread wide so bubbles never collide:
   - Index ←→ Middle ←→ Ring: ~29% horizontal gap each
   - Pinky swings far right, Thumb far left
   - Palm (Outros) sits at center/wrist area
   - Wrist (Aulas) at the very bottom center
   ───────────────────────────────────────────────────────────────── */
interface HandCategory {
  id: Category;
  Icon: React.ElementType;
  label: string;
  bubbleBg: string;
  iconColor: string;
  x: number;  // % of container width
  y: number;  // % of container height
  size: "sm" | "md" | "lg";
  bubbleDelay: number;
  floatDuration: number;
  floatOffset: number;
}

const handCategories: HandCategory[] = [
  // ── Fingertips ──────────────────────────────────────────────────
  //   Middle (tallest): dead center
  { id: "casa",     Icon: House,         label: "Casa",     bubbleBg: "#FFB6C1", iconColor: "#c0394e", x: 50, y: 4,  size: "md", bubbleDelay: 0.40, floatDuration: 3.2, floatOffset: 0.0 },
  //   Index: 29 % to the left  → 21 % from middle
  { id: "cuidados", Icon: Heart,         label: "Cuidados", bubbleBg: "#FFE4E1", iconColor: "#b83254", x: 21, y: 11, size: "md", bubbleDelay: 0.45, floatDuration: 3.5, floatOffset: 0.4 },
  //   Ring:  29 % to the right → 21 % from middle
  { id: "beleza",   Icon: Scissors,      label: "Beleza",   bubbleBg: "#E6E6FA", iconColor: "#6b48b5", x: 79, y: 11, size: "md", bubbleDelay: 0.50, floatDuration: 2.9, floatOffset: 0.8 },
  //   Pinky: far right, lower
  { id: "pets",     Icon: PawPrint,      label: "Pets",     bubbleBg: "#FFE5CC", iconColor: "#b85e1f", x: 93, y: 26, size: "sm", bubbleDelay: 0.60, floatDuration: 3.4, floatOffset: 1.2 },
  //   Thumb: far left, mid-height
  { id: "esportes", Icon: Barbell,       label: "Esportes", bubbleBg: "#B0E0E6", iconColor: "#1a7d8e", x: 7,  y: 48, size: "sm", bubbleDelay: 0.55, floatDuration: 3.8, floatOffset: 0.6 },
  // ── Palm ────────────────────────────────────────────────────────
  { id: "outros",   Icon: GridFour,      label: "Outros",   bubbleBg: "#FFE5B4", iconColor: "#8a5c00", x: 50, y: 62, size: "lg", bubbleDelay: 0.25, floatDuration: 3.0, floatOffset: 1.5 },
  // ── Wrist ───────────────────────────────────────────────────────
  { id: "aulas",    Icon: GraduationCap, label: "Aulas",    bubbleBg: "#F0E68C", iconColor: "#7a6000", x: 50, y: 88, size: "sm", bubbleDelay: 0.65, floatDuration: 3.3, floatOffset: 0.2 },
];

/* ─── SVG finger strokes ─────────────────────────────────────────
   Each path draws from the shared palm origin to the fingertip.
   SVG coords = (x% × 500,  y% × 700) for the fingertip.
   ─────────────────────────────────────────────────────────────── */
interface FingerPath { d: string; length: number; delay: number; width: number; opacity: number }

const fingerPaths: FingerPath[] = [
  // Middle → casa     tip (250,28)
  { d: "M250,345 C250,255 250,150 250,28",    length: 320, delay: 0.10, width: 52, opacity: 0.07 },
  // Index  → cuidados tip (105,77)
  { d: "M193,360 C172,275 143,185 105,77",    length: 308, delay: 0.15, width: 48, opacity: 0.06 },
  // Ring   → beleza   tip (395,77)
  { d: "M307,360 C328,275 360,185 395,77",    length: 305, delay: 0.20, width: 48, opacity: 0.06 },
  // Pinky  → pets     tip (465,182)
  { d: "M348,388 C390,325 432,258 465,182",   length: 252, delay: 0.30, width: 40, opacity: 0.05 },
  // Thumb  → esportes tip (35,336)
  { d: "M163,432 C115,418 72,382 35,336",     length: 172, delay: 0.25, width: 44, opacity: 0.06 },
  // Wrist  bottom
  { d: "M250,505 L250,650",                   length: 145, delay: 0.35, width: 80, opacity: 0.03 },
];

/* ─── Fingertip glow circles (SVG coords) ── */
const glowCircles = [
  { cx: 250, cy: 28,  r: 40, d: 0.50 },  // casa
  { cx: 105, cy: 77,  r: 36, d: 0.55 },  // cuidados
  { cx: 395, cy: 77,  r: 36, d: 0.60 },  // beleza
  { cx: 465, cy: 182, r: 30, d: 0.70 },  // pets
  { cx: 35,  cy: 336, r: 30, d: 0.65 },  // esportes
];

/* ─── Responsive bubble / icon sizes ─────────────────────────────
   Sizes are deliberately modest on mobile so bubbles never overlap.
   sm screens (≥640 px) and md (≥768 px) scale up gracefully.
   ─────────────────────────────────────────────────────────────── */
const sizeMap = {
  sm: {
    bubble: "w-11 h-11 sm:w-[58px] sm:h-[58px] md:w-[68px] md:h-[68px]",
    icon:   "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7",
    label:  "text-[9px] sm:text-[10px] md:text-xs",
  },
  md: {
    bubble: "w-14 h-14 sm:w-[70px] sm:h-[70px] md:w-24 md:h-24",
    icon:   "w-6 h-6 sm:w-7 sm:h-7 md:w-10 md:h-10",
    label:  "text-[10px] sm:text-xs md:text-sm",
  },
  lg: {
    bubble: "w-[60px] h-[60px] sm:w-[78px] sm:h-[78px] md:w-[104px] md:h-[104px]",
    icon:   "w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12",
    label:  "text-[10px] sm:text-xs md:text-sm",
  },
};

/* ─── Component ─────────────────────────────────────────────── */
export function NewOnboarding({ onSearch }: OnboardingProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCepModal, setShowCepModal]         = useState(false);
  const [showWorkerModal, setShowWorkerModal]   = useState(false);

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategory(cat);
    setShowCepModal(true);
  };

  const handleCepSubmit = (cep: string) => {
    if (selectedCategory) onSearch(selectedCategory, cep);
  };

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          ROOT — full-screen gradient, scrollable on tiny devices
      ══════════════════════════════════════════════════════════ */}
      <div className="min-h-screen bg-gradient-to-br from-[#5eb3b3] via-[#4fa8a8] to-[#3d8e8e] flex flex-col items-center justify-center px-4 pt-20 pb-10 relative overflow-hidden select-none">

        {/* ── Ambient blurs (decorative) ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/[0.04] rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-24 w-96 h-96 bg-white/[0.04] rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-white/[0.03] rounded-full blur-3xl animate-pulse-soft" />
        </div>

        {/* ── Logo — absolute top-left ── */}
        <div className="absolute top-5 left-5 z-20 animate-fade-in">
          <div className="flex items-center gap-2">
            <svg width="34" height="34" viewBox="0 0 64 64" fill="none">
              <path d="M32 14C28 14 25 17 25 21C25 24 27 26 29 27L24 38C23 40 24 42 26 43H38C40 42 41 40 40 38L35 27C37 26 39 24 39 21C39 17 36 14 32 14Z" fill="white" />
              <circle cx="22" cy="28" r="4" fill="white" fillOpacity="0.85" />
              <circle cx="42" cy="28" r="4" fill="white" fillOpacity="0.85" />
            </svg>
            <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">mãozinhas</span>
          </div>
        </div>

        {/* ── Headline ── */}
        <h2
          className="relative z-10 text-white text-base sm:text-lg md:text-xl font-light text-center mb-12 sm:mb-12 animate-fade-in-up"
          style={{ animationDelay: "0.15s", opacity: 0, animationFillMode: "forwards" }}
        >
          O que você precisa hoje?
        </h2>

        {/* ══════════════════════════════════════════════════════════
            HAND CONTAINER
            Width: 88 vw on mobile, capped at 360 / 420 / 480 px.
            The 500 : 700 aspect ratio is preserved via CSS.
        ══════════════════════════════════════════════════════════ */}
        <div
          className="relative z-10 w-[88vw] max-w-[360px] sm:max-w-[420px] md:max-w-[480px] mx-auto"
          style={{ aspectRatio: "500 / 700" }}
        >
          {/* ── Hand silhouette SVG ── */}
          <svg
            viewBox="0 0 500 700"
            className="absolute inset-0 w-full h-full pointer-events-none"
            fill="none"
          >
            <defs>
              <radialGradient id="palmGlow" cx="50%" cy="65%" r="50%">
                <stop offset="0%"   stopColor="white" stopOpacity="0.09" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Palm glow */}
            <ellipse cx="250" cy="430" rx="130" ry="115" fill="url(#palmGlow)" />

            {/* Finger strokes — drawn on via CSS animation */}
            {fingerPaths.map((fp, i) => (
              <path
                key={i}
                d={fp.d}
                stroke="white"
                strokeWidth={fp.width}
                strokeLinecap="round"
                fill="none"
                opacity={fp.opacity}
                strokeDasharray={fp.length}
                strokeDashoffset={fp.length}
                style={{ animation: `drawFinger 0.7s ease-out ${fp.delay}s forwards` }}
              />
            ))}
          </svg>

          {/* ── Fingertip glow pulses (separate SVG for clean opacity) ── */}
          <svg viewBox="0 0 500 700" className="absolute inset-0 w-full h-full pointer-events-none" fill="none">
            {glowCircles.map((g, i) => (
              <circle key={i} cx={g.cx} cy={g.cy} r={g.r} fill="white"
                style={{ opacity: 0, animation: `glowPulse 2.5s ease-in-out ${g.d + 0.6}s infinite` }}
              />
            ))}
          </svg>

          {/* ── Category bubbles ── */}
          {handCategories.map((cat) => {
            const s = sizeMap[cat.size];
            return (
              <div
                key={cat.id}
                className="absolute"
                style={{ left: `${cat.x}%`, top: `${cat.y}%`, transform: "translate(-50%, -50%)" }}
              >
                {/* Staggered fade-in */}
                <div
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${cat.bubbleDelay}s`, opacity: 0, animationFillMode: "forwards" }}
                >
                  {/* Gentle float loop */}
                  <div style={{ animation: `gentleFloat ${cat.floatDuration}s ease-in-out ${cat.floatOffset + 1.2}s infinite` }}>
                    <button
                      onClick={() => handleCategoryClick(cat.id)}
                      className="flex flex-col items-center gap-1 sm:gap-1.5 group focus:outline-none"
                    >
                      {/* Bubble */}
                      <div
                        className={`${s.bubble} rounded-full flex items-center justify-center
                          shadow-[0_6px_22px_rgba(0,0,0,0.14)]
                          group-hover:shadow-[0_10px_34px_rgba(0,0,0,0.22)]
                          group-hover:scale-110 group-focus:scale-110
                          transition-all duration-300 ease-out`}
                        style={{ backgroundColor: cat.bubbleBg }}
                      >
                        <cat.Icon weight="duotone" className={s.icon} style={{ color: cat.iconColor }} />
                      </div>
                      {/* Label */}
                      <span className={`${s.label} text-white font-medium drop-shadow-md whitespace-nowrap leading-none`}>
                        {cat.label}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom tagline ── */}
        <p
          className="relative z-10 text-white/40 text-[9px] sm:text-[10px] text-center mt-4 sm:mt-6 animate-fade-in px-6"
          style={{ animationDelay: "1s", opacity: 0, animationFillMode: "forwards" }}
        >
          Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade
        </p>

        {/* ══════════════════════════════════════════════════════════
            PROVIDER CARD — fixed, bottom-left
            Compact on mobile, full label on sm+
        ══════════════════════════════════════════════════════════ */}
        <div
          className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 animate-fade-in"
          style={{ animationDelay: "1.3s", opacity: 0, animationFillMode: "forwards" }}
        >
          <button
            onClick={() => setShowWorkerModal(true)}
            className="group flex items-center gap-2.5
              bg-white/10 hover:bg-white/18 active:bg-white/22
              backdrop-blur-md
              border border-white/15 hover:border-white/35
              text-white rounded-2xl
              px-3 py-2.5 sm:px-4 sm:py-3
              shadow-[0_4px_20px_rgba(0,0,0,0.12)]
              hover:shadow-[0_6px_28px_rgba(0,0,0,0.20)]
              transition-all duration-300 ease-out"
          >
            {/* Icon badge */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/15 group-hover:bg-white/25 flex items-center justify-center flex-shrink-0 transition-colors">
              <Briefcase weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>

            {/* Text — hidden on very small screens, visible from xs up */}
            <div className="text-left hidden min-[300px]:block">
              <p className="text-[9px] sm:text-[10px] text-white/55 leading-none mb-0.5 font-medium">Trabalha na área?</p>
              <p className="text-xs sm:text-sm font-semibold text-white leading-tight">Sou prestador</p>
            </div>

            {/* Arrow */}
            <CaretRight
              weight="bold"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/40 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all flex-shrink-0 hidden min-[300px]:block"
            />
          </button>
        </div>
      </div>

      {/* ── Modals ── */}
      <CepModal
        isOpen={showCepModal}
        onClose={() => setShowCepModal(false)}
        onSubmit={handleCepSubmit}
        category={selectedCategory ? categoryLabels[selectedCategory] : ""}
      />

      <WorkerRegistrationModal
        isOpen={showWorkerModal}
        onClose={() => setShowWorkerModal(false)}
      />
    </>
  );
}
