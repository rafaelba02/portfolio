# Rafael Balle – Portfolio

Static, bilingual (DE/EN) portfolio site for Rafael Balle — industrial and eco-social design, based in Lucerne.

## Tech Stack

- **HTML / CSS / JavaScript** — no frameworks, no build step
- **IBM Plex** fonts (Sans + Mono) self-hosted as `.woff2`
- **Vercel** for hosting; `/_vercel/insights` and `/_vercel/speed-insights` scripts on main pages
- **`vercel.json`** — global `Referrer-Policy: strict-origin-when-cross-origin`
- Local preview: `npm start` (same as `npx serve .`)

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Intro, photo carousel (21 slides with location captions), CTA to projects |
| About | `about.html` | Portrait carousel, expandable hashtag sections, CV timeline, skills grid |
| Projects | `projects.html` | Project cards with hover key-visual previews |
| Impressum | `impressum.html` | Legal imprint (German) |
| Datenschutz | `datenschutz.html` | Privacy policy (German) |

### Project case studies (`projects/`)

| Project | File | Notes |
|---------|------|--------|
| myply | `myply.html` | Product design (solo) |
| Room controller redesign | `interface-raumsteuerung.html` | Interface design (group) |
| Teapot meets thermos | `teapot-meets-thermos.html` | 3D design (solo) |
| Nachbar Garten | `maria-rickenbach.html` | Eco-social connect module (group) |
| Pneumatic tube container | `aerocom-rohrpost.html` | Ergonomics, with Aerocom |
| ChemCheck | `chemcheck.html` | Product design, Smarttools (group) |
| Heat pump redesign | `waermepumpe.html` | Internship (solo) |
| Photography | `photos.html` | Photo gallery |

## Structure

```
index.html / about.html / projects.html   Main pages
impressum.html / datenschutz.html          Legal pages
projects/*.html                            Project detail pages
css/styles.css                             Single stylesheet
js/
  lang.js                                  DE/EN toggle (localStorage)
  cursor.js                                Custom cursor (desktop)
  script.js                                Shared behavior (e.g. project-card hover)
  home-carousel.js                         Home photo carousel
  about-carousel.js                        About portrait carousel
  hashtags.js                              Expandable hashtag sections
  chemcheck-stats-scroll.js                ChemCheck scroll-driven stats panel
  photos-carousel-maps.js                  Photography carousel
  photos-minimap.js                        Photography minimap UI
fonts/                                     IBM Plex .woff2 files
assets/
  keyvisuals/                              Project card thumbnails
  images/                                  Photos, sliders, project assets
favico.svg                                 Favicon
vercel.json                                HTTP headers for Vercel
package.json                               npm scripts (`start` / `preview`)
```

## Design

- **Palette:** white background, near-black text (`#111`), accent blue (`#0F35FF`)
- **Typography:** IBM Plex Sans for body, IBM Plex Mono for select headings; fluid sizing via `clamp()`
- **Layout:** full-viewport framed pages, CSS grids, responsive breakpoint around 860px
- **Custom cursor:** smooth-following dot on desktop; hidden on touch/narrow screens
- **Motion:** carousel autoplay, hover transitions, scroll-driven animations; respects `prefers-reduced-motion`
- **i18n:** `data-lang` on `<html>` toggles duplicate DE/EN content blocks

## Running locally

```bash
npm start
```

Or:

```bash
npx serve .
```

Then open the URL shown in the terminal.

## Contact

- **Email:** rafael.balle@outlook.de
- **LinkedIn:** [linkedin.com/in/rafael-balle](https://www.linkedin.com/in/rafael-balle/)
