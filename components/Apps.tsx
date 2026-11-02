"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import type { App } from "@/lib/portfolio";
import { AndroidIcon, AppleIcon, ChevronIcon, CloseIcon, GlobeIcon, GridIcon } from "./icons";

// Apps without screenshots still get four placeholder screens so the layout holds.
const PLACEHOLDER_COUNT = 4;

type Shot = { src: string; label: string };

function shotsOf(app: App): Shot[] {
  if (app.screenshots.length) {
    return app.screenshots.map((src, k) => ({ src, label: `${app.name} screenshot ${k + 1}` }));
  }
  return Array.from({ length: PLACEHOLDER_COUNT }, (_, k) => ({ src: "", label: `Screenshot ${k + 1}` }));
}

function screenBg(color: string): CSSProperties {
  return {
    background: `linear-gradient(165deg, color-mix(in srgb, ${color} 92%, #fff), color-mix(in srgb, ${color} 62%, #000))`,
    color: `color-mix(in srgb, ${color} 25%, #000)`,
  };
}

function ScreenContent({ shot, alt }: { shot: Shot; alt: string }) {
  if (shot.src) {
    // Screenshots come from arbitrary hosts listed in portfolio.json, so a plain img avoids per-domain config.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={shot.src} alt={alt} loading="lazy" decoding="async" />;
  }
  return <span className="screen-placeholder">{shot.label}</span>;
}

function AppIcon({ app }: { app: App }) {
  return (
    <span className="app-icon" aria-hidden="true" style={{ background: app.color }}>
      {app.name.charAt(0)}
    </span>
  );
}

function stripScheme(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export default function Apps({ apps }: { apps: App[] }) {
  const [open, setOpen] = useState<{ app: number; i: number } | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const show = (app: number, i: number, trigger: HTMLElement) => {
    lastTrigger.current = trigger;
    setOpen({ app, i });
  };

  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);

  const current = open ? apps[open.app] : null;
  const shots = current ? shotsOf(current) : [];
  const n = shots.length;

  const step = useCallback(
    (d: number) => setOpen((o) => (o ? { ...o, i: (o.i + d + n) % n } : o)),
    [n],
  );

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
    // Only re-run when the viewer opens or closes, not on every slide change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open === null, close, step]);

  return (
    <>
      {apps.map((app, a) => {
        const appShots = shotsOf(app);
        // Back-left, back-right, then front, so the front phone paints last.
        const stack = ([[1, "ph1"], [2, "ph2"], [0, "ph0"]] as const).filter(([k]) => k < appShots.length);
        const id = `app-${a}`;
        return (
          <article key={app.name} className={a % 2 ? "show flip" : "show"} aria-labelledby={id}>
            <div className="info">
              <div className="meta mono">
                <span>
                  {String(a + 1).padStart(2, "0")} / {String(apps.length).padStart(2, "0")}
                </span>
                {app.category && (
                  <>
                    <i aria-hidden="true" />
                    <span style={{ color: app.color }}>{app.category}</span>
                  </>
                )}
              </div>
              <div className="title">
                <AppIcon app={app} />
                <h3 id={id} className="grad">
                  {app.name}
                </h3>
              </div>
              {app.description && <p className="desc">{app.description}</p>}
              {(app.ios || app.android || app.web) && (
                <div className="links">
                  {app.ios && (
                    <a className="pill" href={app.ios} target="_blank" rel="noopener noreferrer">
                      <AppleIcon /> App Store
                    </a>
                  )}
                  {app.android && (
                    <a className="pill" href={app.android} target="_blank" rel="noopener noreferrer">
                      <AndroidIcon /> Google Play
                    </a>
                  )}
                  {app.web && (
                    <a className="pill" href={app.web} target="_blank" rel="noopener noreferrer">
                      <GlobeIcon /> {stripScheme(app.web)}
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="stage">
              <div
                className="stage-glow"
                aria-hidden="true"
                style={{ background: `radial-gradient(closest-side, color-mix(in srgb, ${app.color} 30%, transparent), transparent)` }}
              />
              <div className="stagegrid" aria-hidden="true" />
              {stack.map(([k, cls]) => (
                <button
                  key={k}
                  type="button"
                  className={`ph screen ${cls}`}
                  style={screenBg(app.color)}
                  aria-label={`View ${app.name} screenshot ${k + 1}`}
                  onClick={(e) => show(a, k, e.currentTarget)}
                >
                  <ScreenContent shot={appShots[k]} alt="" />
                </button>
              ))}
              <button type="button" className="more" onClick={(e) => show(a, 0, e.currentTarget)}>
                <GridIcon /> All {appShots.length} screens
              </button>
            </div>
          </article>
        );
      })}

      {open && current && createPortal(
        <div className="lb" role="dialog" aria-modal="true" aria-label={`${current.name} screenshots`}>
          <button type="button" className="lb-backdrop" onClick={close} aria-label="Close screenshots" tabIndex={-1} />
          <div
            className="lb-glow"
            aria-hidden="true"
            style={{ background: `radial-gradient(closest-side, color-mix(in srgb, ${current.color} 18%, transparent), transparent)` }}
          />
          <div className="lb-top">
            <div className="lb-title">
              <AppIcon app={current} />
              {current.name}
              <span className="mono" aria-live="polite">
                {open.i + 1} / {n}
              </span>
            </div>
            <button ref={closeRef} type="button" className="lbbtn lb-close" onClick={close} aria-label="Close screenshots">
              <CloseIcon />
            </button>
          </div>

          <div className="track">
            {shots.map((shot, k) => {
              const d = k - open.i;
              const ad = Math.abs(d);
              const scale = d === 0 ? 1 : ad === 1 ? 0.8 : 0.66;
              const opacity = d === 0 ? 1 : ad === 1 ? 0.45 : ad === 2 ? 0.15 : 0;
              return (
                <button
                  key={k}
                  type="button"
                  className="cs screen"
                  tabIndex={d === 0 ? 0 : -1}
                  aria-hidden={ad > 1}
                  aria-label={d === 0 ? shot.label : `Go to screenshot ${k + 1}`}
                  onClick={() => setOpen({ app: open.app, i: k })}
                  style={{
                    ...screenBg(current.color),
                    zIndex: 10 - ad,
                    opacity,
                    cursor: d === 0 ? "default" : "pointer",
                    filter: d === 0 ? "none" : "saturate(.7)",
                    transform: `translateX(calc(-50% + ${d * 78}%)) scale(${scale})`,
                    boxShadow: d === 0 ? `0 50px 140px -30px color-mix(in srgb, ${current.color} 55%, transparent)` : "none",
                  }}
                >
                  <ScreenContent shot={shot} alt={shot.label} />
                </button>
              );
            })}
            <button type="button" className="lbbtn lb-arrow lb-prev" onClick={() => step(-1)} aria-label="Previous screenshot">
              <ChevronIcon dir="left" />
            </button>
            <button type="button" className="lbbtn lb-arrow lb-next" onClick={() => step(1)} aria-label="Next screenshot">
              <ChevronIcon dir="right" />
            </button>
          </div>

          <div className="thumbs">
            {shots.map((shot, k) => (
              <button
                key={k}
                type="button"
                className="tn screen"
                aria-label={`Show screenshot ${k + 1}`}
                aria-current={k === open.i}
                onClick={() => setOpen({ app: open.app, i: k })}
                style={screenBg(current.color)}
              >
                {shot.src && <ScreenContent shot={shot} alt="" />}
              </button>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
