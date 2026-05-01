/**
 * Theme metadata used by the ThemeSwitcher and the root layout.
 * The actual CSS values live in app/globals.css under [data-theme="..."].
 *
 * `bg` and `accent` here are display-only swatches for the picker; they should
 * approximate the resolved OKLCH values from globals.css.
 */

export type ThemeId =
  | "recruiter-light"
  | "ivory-minimal"
  | "warm-editorial"
  | "soft-glass"
  | "executive-dark"
  | "premium-black"
  | "midnight-blue"
  | "graphite-purple"
  | "cyber-slate"
  | "terminal-pro";

export interface Theme {
  id: ThemeId;
  name: string;
  mode: "light" | "dark";
  /** Approximate background swatch for the picker. */
  bg: string;
  /** Approximate accent swatch for the picker. */
  accent: string;
  /** One-line description used as the swatch tooltip. */
  description: string;
}

export const THEMES: Theme[] = [
  {
    id: "recruiter-light",
    name: "Recruiter Light",
    mode: "light",
    bg: "oklch(0.985 0.004 85)",
    accent: "oklch(0.46 0.07 200)",
    description: "Warm paper. The default, tuned for skim reading.",
  },
  {
    id: "ivory-minimal",
    name: "Ivory Minimal",
    mode: "light",
    bg: "oklch(0.975 0.005 70)",
    accent: "oklch(0.32 0.02 60)",
    description: "Quiet ivory with a near-black accent.",
  },
  {
    id: "warm-editorial",
    name: "Warm Editorial",
    mode: "light",
    bg: "oklch(0.965 0.014 55)",
    accent: "oklch(0.42 0.13 30)",
    description: "Cream and brick. Print magazine.",
  },
  {
    id: "soft-glass",
    name: "Soft Glass",
    mode: "light",
    bg: "oklch(0.97 0.008 220)",
    accent: "oklch(0.52 0.10 240)",
    description: "Cool pearl, indigo accent. No actual glass.",
  },
  {
    id: "executive-dark",
    name: "Executive Dark",
    mode: "dark",
    bg: "oklch(0.16 0.008 35)",
    accent: "oklch(0.78 0.10 75)",
    description: "Warm charcoal, brass accent.",
  },
  {
    id: "premium-black",
    name: "Premium Black",
    mode: "dark",
    bg: "oklch(0.10 0.006 215)",
    accent: "oklch(0.92 0.012 215)",
    description: "Near-black surface, monochrome accent.",
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    mode: "dark",
    bg: "oklch(0.14 0.018 245)",
    accent: "oklch(0.74 0.11 230)",
    description: "Deep navy with a clear blue accent.",
  },
  {
    id: "graphite-purple",
    name: "Graphite Purple",
    mode: "dark",
    bg: "oklch(0.16 0.012 305)",
    accent: "oklch(0.72 0.10 305)",
    description: "Warm graphite, mauve accent.",
  },
  {
    id: "cyber-slate",
    name: "Cyber Slate",
    mode: "dark",
    bg: "oklch(0.14 0.014 200)",
    accent: "oklch(0.80 0.10 180)",
    description: "Cold slate, mint highlight.",
  },
  {
    id: "terminal-pro",
    name: "Terminal Pro",
    mode: "dark",
    bg: "oklch(0.135 0.010 145)",
    accent: "oklch(0.80 0.16 145)",
    description: "Tinted carbon, phosphor green. Mono UI.",
  },
];

export const DEFAULT_THEME: ThemeId = "recruiter-light";
export const THEME_STORAGE_KEY = "resume-bot.theme";

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && THEMES.some((t) => t.id === value);
}
