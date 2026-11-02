import Apps from "@/components/Apps";
import { portfolio } from "@/lib/portfolio";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;


export default function Home() {
  const p = portfolio;
  const socials = [
    { label: "GitHub", href: p.github },
    { label: "LinkedIn", href: p.linkedin },
    { label: "X", href: p.x },
    { label: "Résumé", href: p.resume },
  ].filter((s) => s.href);

  return (
    <>
      <header className="nav">
        <nav aria-label="Main" className="wrap nav-inner">
          <a href="#top" className="brand">
            {p.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.logo} alt="" width={28} height={28} />
            )}
            {p.name}
          </a>
          <div className="navlinks">
            {p.apps.length > 0 && <a className="navlink" href="#apps">Apps</a>}
            {p.archive.length > 0 && <a className="navlink" href="#archive">Archive</a>}
            {p.github && <a className="navlink" href={p.github} {...external}>GitHub</a>}
            {p.resume && <a className="navlink" href={p.resume} {...external}>Résumé</a>}
          </div>
          {p.email && (
            <a href="#contact" className="btn btn-solid btn-sm">
              Say hi
            </a>
          )}
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="glow" aria-hidden="true" />
          <div className="gridbg" aria-hidden="true" />
          <div className="wrap hero-inner">
            {p.logo && (
              <div className="avatar rise">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.logo} alt={`${p.name}'s avatar`} width={96} height={96} />
              </div>
            )}
            <div>
              <h1 className="rise d1">Hi, I&apos;m {p.name}.</h1>
              {p.description && (
                <p className="hero-lede rise d2">
                  {p.description} {p.apps.length > 0 && <strong>Here&apos;s what I&apos;ve made.</strong>}
                </p>
              )}
            </div>
            <div className="hero-links rise d3">
              {p.email && (
                <a href={`mailto:${p.email}`}>
                  <span className="dot" aria-hidden="true" />
                  {p.email}
                </a>
              )}
              {socials.map((s) => (
                <a key={s.label} className="navlink" href={s.href} {...external}>
                  {s.label} ↗
                </a>
              ))}
            </div>
          </div>
        </section>

        {p.apps.length > 0 && (
          <section id="apps" className="wrap apps" aria-labelledby="apps-title">
            <div className="apps-head">
              <h2 id="apps-title">Apps I&apos;ve built</h2>
              <span className="mono">Tap a screen to look closer</span>
            </div>
            <Apps apps={p.apps} />
          </section>
        )}

        {p.archive.length > 0 && (
          <section id="archive" className="wrap archive" aria-labelledby="archive-title">
            <div className="archive-head">
              <span className="eyebrow mono">Archive</span>
              <h2 id="archive-title" className="grad">Earlier apps.</h2>
              <p>Older projects. Some are no longer live.</p>
            </div>
            <ul className="archive-list">
              {p.archive.map((a) => (
                <li key={a.name} className="row">
                  <span className="row-name">{a.name}</span>
                  <span className="row-desc">{a.description}</span>
                  {a.link ? (
                    <a className="row-status mono" href={a.link} {...external}>
                      View ↗<span className="sr-only"> {a.name}</span>
                    </a>
                  ) : (
                    <span className="row-status mono">Offline</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="contact" className="contact" aria-labelledby="contact-title">
          <div className="glow" aria-hidden="true" />
          <div className="gridbg" aria-hidden="true" />
          <div className="wrap contact-inner">
            {p.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.logo} alt="" width={72} height={72} />
            )}
            <h2 id="contact-title" className="grad">Thanks for stopping by.</h2>
            <p>Working on an app, or just want to talk shop? My inbox is open.</p>
            <div className="actions">
              {p.email && (
                <a href={`mailto:${p.email}`} className="btn btn-solid btn-lg">
                  {p.email}
                </a>
              )}
              {p.resume && (
                <a href={p.resume} className="btn btn-ghost btn-lg" {...external}>
                  Résumé ↗
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <span>
            © {new Date().getFullYear()} {p.name}
          </span>
          <div className="footer-links">
            {socials
              .filter((s) => s.label !== "Résumé")
              .map((s) => (
                <a key={s.label} className="navlink" href={s.href} {...external}>
                  {s.label}
                </a>
              ))}
          </div>
        </div>
      </footer>
    </>
  );
}
