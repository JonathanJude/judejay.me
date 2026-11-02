import raw from "@/data/portfolio.json";

export type App = {
  name: string;
  category: string;
  description: string;
  /** Brand colour used for the app's glow and placeholder screens. */
  color: string;
  ios: string;
  android: string;
  web: string;
  /** Image URLs (absolute, or paths under /public). */
  screenshots: string[];
};

export type ArchivedApp = {
  name: string;
  description: string;
  /** Leave empty when the app is no longer available. */
  link: string;
};

export type Portfolio = {
  name: string;
  /** Public site URL, used for social preview links. */
  url: string;
  description: string;
  logo: string;
  email: string;
  linkedin: string;
  github: string;
  x: string;
  resume: string;
  accent: string;
  apps: App[];
  archive: ArchivedApp[];
};

const FALLBACK_COLORS = ["#4BF0B0", "#FF6A2C", "#8B8CFF", "#5B82FF", "#FFB020", "#3FD39A"];

function str(value: unknown, field: string, required = false): string {
  if (value === undefined || value === null) {
    if (required) throw new Error(`portfolio.json: "${field}" is required`);
    return "";
  }
  if (typeof value !== "string") throw new Error(`portfolio.json: "${field}" must be a string`);
  if (required && !value.trim()) throw new Error(`portfolio.json: "${field}" must not be empty`);
  return value.trim();
}

function list(value: unknown, field: string): unknown[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new Error(`portfolio.json: "${field}" must be an array`);
  return value;
}

// Validates the JSON at build time so a typo fails the build instead of shipping a broken page.
function parse(data: Record<string, unknown>): Portfolio {
  const apps = list(data.apps, "apps").map((item, i) => {
    const a = item as Record<string, unknown>;
    const at = `apps[${i}]`;
    return {
      name: str(a.name, `${at}.name`, true),
      category: str(a.category, `${at}.category`),
      description: str(a.description, `${at}.description`),
      color: str(a.color, `${at}.color`) || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
      ios: str(a.ios, `${at}.ios`),
      android: str(a.android, `${at}.android`),
      web: str(a.web, `${at}.web`),
      screenshots: list(a.screenshots, `${at}.screenshots`).map((s, k) =>
        str(s, `${at}.screenshots[${k}]`, true),
      ),
    };
  });

  const archive = list(data.archive, "archive").map((item, i) => {
    const a = item as Record<string, unknown>;
    return {
      name: str(a.name, `archive[${i}].name`, true),
      description: str(a.description, `archive[${i}].description`),
      link: str(a.link, `archive[${i}].link`),
    };
  });

  return {
    name: str(data.name, "name", true),
    url: str(data.url, "url"),
    description: str(data.description, "description"),
    logo: str(data.logo, "logo"),
    email: str(data.email, "email"),
    linkedin: str(data.linkedin, "linkedin"),
    github: str(data.github, "github"),
    x: str(data.x, "x"),
    resume: str(data.resume, "resume"),
    accent: str(data.accent, "accent") || "#D4FF3F",
    apps,
    archive,
  };
}

export const portfolio = parse(raw as Record<string, unknown>);
