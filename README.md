# judejay.dev

My personal portfolio: a single page that shows the apps I've built. Everything on the page comes from one file, [`data/portfolio.json`](data/portfolio.json).

Built with Next.js (App Router) and prerendered as a static page.

## Editing the content

Open `data/portfolio.json` and change the values. The build checks the file, and fails with a clear message if a required field is missing or has the wrong type.

```jsonc
{
  "name": "Jude Jonathan",              // required
  "url": "https://judejay.dev",         // used for social previews
  "description": "Short intro shown under the greeting.",
  "logo": "/memoji.png",                // avatar; a path in /public or a full URL
  "email": "you@example.com",
  "linkedin": "https://www.linkedin.com/in/…",
  "github": "https://github.com/…",
  "x": "https://x.com/…",
  "resume": "https://…",
  "accent": "#D4FF3F",                  // optional highlight colour
  "apps": [
    {
      "name": "AfterHours",             // required
      "category": "Nightlife",
      "description": "What the app does.",
      "color": "#4BF0B0",               // optional; drives the glow and placeholder screens
      "ios": "https://apps.apple.com/…",
      "android": "https://play.google.com/…",
      "web": "https://…",
      "screenshots": ["/screens/afterhours-1.png", "https://…/2.png"]
    }
  ],
  "archive": [
    { "name": "Staarm", "description": "…", "link": "https://…" }
  ]
}
```

- Leave any link as `""` to hide its button. Social links work the same way.
- `screenshots` takes image URLs or paths under `public/`. Portrait phone screenshots (about 9:19.5) look best. The first three form the stack on the page, and all of them appear in the full-screen viewer. An app with no screenshots shows four placeholder screens.
- `archive` is for older apps. Leave `link` empty for apps that are no longer available, and the row shows "Offline".

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build
```
