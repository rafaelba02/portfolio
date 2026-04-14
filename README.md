# Rafael Balle – Portfolio

Static, bilingual (DE/EN) portfolio website for Rafael Balle, eco-social and industrial design student in Lucerne.

## Tech Stack

- **HTML / CSS / JavaScript** – no frameworks, no build step
- **IBM Plex** fonts (Sans + Mono) self-hosted as `.woff2`
- **Vercel** for deployment (analytics & speed insights included)
- Local preview via `npx serve .`

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Intro text, photo carousel (23 slides with location captions), CTA to projects |
| About | `about.html` | Portrait carousel, expandable hashtag sections, CV timeline, skills grid |
| Projects | `projects.html` | Grid of project cards with hover key-visual previews |
| Impressum | `impressum.html` | Legal imprint (German) |
| Datenschutz | `datenschutz.html` | Privacy policy (German) |

### Project Case Studies (`projects/`)

- **myply** – product design (solo)
- **Room Controller Redesign** – interface design (group)
- **Teapot Meets Thermos** – 3D design (solo)
- **Nachbar Garten** – eco-social connect module (group)
- **Pneumatic Tube Container** – ergonomics, with Aerocom
- **ChemCheck** – product design, Smarttools (group)
- **Heat Pump Redesign** – internship project (solo)
- **Photography** – photo gallery

## Structure

```
index.html / about.html / projects.html   Main pages
impressum.html / datenschutz.html          Legal pages
projects/                                  Individual project detail pages
css/styles.css                             Single stylesheet
js/
  lang.js                                  DE/EN language toggle (localStorage)
  cursor.js                                Custom cursor (desktop only)
  script.js                                Project-card hover preview
  home-carousel.js                         Home photo carousel
  about-carousel.js                        About portrait carousel
  hashtags.js                              Expandable hashtag sections
  chemcheck-stats-scroll.js                Scroll-driven sticky stats panel
fonts/                                     IBM Plex .woff2 files
assets/
  keyvisuals/                              Project card thumbnails
  images/                                  Photos, sliders, project assets
favico.svg                                 Favicon
```

## Design

- **Palette:** white background, near-black text (`#111`), accent blue (`#0F35FF`)
- **Typography:** IBM Plex Sans for body, IBM Plex Mono for select headings; fluid sizing via `clamp()`
- **Layout:** full-viewport framed pages, 4-column CSS grids, responsive breakpoint at 860px
- **Custom cursor:** smooth-following dot on desktop, hidden on touch/narrow screens
- **Motion:** carousel autoplay, hover transitions, scroll-driven animations; respects `prefers-reduced-motion`
- **i18n:** `data-lang` attribute on `<html>` toggles duplicate DE/EN content blocks

## Running Locally

```bash
npm start
```

Or directly:

```bash
npx serve .
```

Then open the shown URL in your browser.

## Contact

- **Email:** rafael.balle@outlook.de
- **LinkedIn:** [linkedin.com/in/rafael-balle](https://www.linkedin.com/in/rafael-balle/)
