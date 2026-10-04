
# Personal Website

[![view - Site](https://img.shields.io/badge/View-Personal_website-blue)](https://leocml.com)

This website is based on [vCard - Personal portfolio](https://github.com/codewithsadee/vcard-personal-portfolio.git)

This repository was forked (then detached) from the [vCard - Personal portfolio](https://github.com/codewithsadee/vcard-personal-portfolio.git) by [codewithsadee](https://github.com/codewithsadee), which is released under the MIT License (see LICENSE).

## License

MIT

## Site Content Sources

The site remains static HTML, CSS, and JavaScript, with no package installation or frontend build framework required.

Shared profile details, English and Traditional Chinese interface copy, and all bilingual project-detail content are maintained in `assets/js/site-data.js`. That file is consumed directly in the browser and by the Node.js content synchronizer, so it is the source of truth for those values.

After editing shared profile data, project data, or translations in `assets/js/site-data.js`, refresh every checked-in consumer with:

```powershell
node generate-blog-index.js
node generate-site-content.js
```

When adding or replacing a raster image, generate the responsive WebP variants and media manifest first:

```powershell
python scripts/optimize-images.py
node generate-blog-index.js
node generate-site-content.js
```

Original files in `assets/images` remain the archival and social-sharing sources. Page markup uses the generated variants in `assets/images/optimized`, while `assets/data/media-manifest.json` supplies intrinsic dimensions and responsive candidates. Gallery thumbnails use dedicated 240-pixel variants, and non-selected gallery media is loaded only when selected.

Project translations preserve responsive image attributes from the generated page,
matched by `data-media-source`, before inserting translated content. Alternative
text and captions still come from the selected language; images and video embeds
retain lazy loading. Keep images shared across a project's language versions so
each translated image can reuse its generated media metadata. The static audit
checks this mapping for images in the media manifest.

The generators update the shared profile shell and translated fallbacks on the homepage, project pages, the legacy blog page, and generated blog pages. They also keep project URLs, sitemap entries, page and social metadata, JSON-LD catalog data, and English project overviews and detail bodies aligned with the same project registry. Do not edit generated project `.project-intro-copy`, `.project-lead-media`, or `.project-content` blocks directly.

Project pages begin with a `.project-lead` containing the overview and existing
gallery, or the first image figure/media grid extracted from canonical project
copy by `splitProjectContent()`. That function returns `overview`, `leadMedia`,
and `details`, so a lead image is moved rather than duplicated. Runtime language
switching translates lead captions and alternative text independently while
retaining generated responsive attributes. The static audit checks both lead
and detail media against the image manifest.

To verify that checked-in HTML is current without writing files:

```powershell
python scripts/optimize-images.py --check
node generate-blog-index.js --check
node generate-site-content.js --check
node scripts/check-static-site.js
```

The static-site audit verifies canonical and social metadata, JSON-LD, sitemap
coverage and dates, case-sensitive local assets, internal links and fragments,
unique IDs, heading structure, and the generated homepage blog fallback. The
same audit runs in GitHub Actions before generated content can be committed.

## Visual System

Portfolio pages use `assets/css/style.css` as the legacy component base and
`assets/css/field-notes.css` as the scoped responsive design layer. The latter
only applies inside `body.portfolio-site`, keeping `dashboard.html` isolated.
Homepage project-rail behavior lives in
`assets/css/custom_project_preview.css` and `assets/js/project-preview.js`. It
automatically advances when motion is allowed, provides a pause/resume control,
and retains native horizontal scrolling and scroll snap for direct navigation.
Previous/next controls also let visitors advance the rail directly. Gallery
thumbnails support keyboard navigation and announce the selected media position.
Hover pauses the rail while reading; keyboard focus reveals the full card and
pauses automatic movement. Touch and reduced-motion preferences disable pointer
effects. The bilingual typography uses Poppins and Noto Sans TC consistently.
The contact form retains its visible reCAPTCHA notice and policy links while the
floating badge is hidden, following Google's documented branding option.

When adding a new portfolio or blog template, include the `portfolio-site`
body class and load `field-notes.css` after `style.css`. Generated blog pages
inherit both from `generate-blog-index.js`.

On screens up to 700 pixels wide, the primary routes collapse into a labeled
menu while the language and theme controls remain visible. Shared pages also
include a keyboard skip link, an announced contact-details toggle, and a
consistent `#content-start` target. Keep these elements in new templates by
running `generate-site-content.js` rather than copying the shell by hand.

## RoBosun-Tapper assembly viewer

`tapper.html` loads `assets/models/robosun-tapper.glb` near the viewport. The model
comes from the local SolidWorks assembly, with image-reconstructed thruster
guards. See `assets/models/README.md` for provenance and limitations.

`assets/js/tapper-exploded.js` maps named CAD subassemblies into a stationary
frame plus thrusters, drive assemblies, retractable linkage, and tapping head.
Staged scroll offsets illustrate subsystem relationships, not disassembly or
joint motion. Whole subassemblies retain their internal parts and fasteners.

Three.js 0.180.0, GLTFLoader and MeshoptDecoder are vendored locally. Rendering
occurs on interaction/scroll/resize. Labels wrap in separate rows outside the canvas.
Phones, reduced motion, and viewports too short for the full panel use manual controls
and normal page scrolling. Camera framing follows the full pose at every size and yaw;
pixel density is capped at 1.5 for canvases under 600px wide. Asset or WebGL failure
falls back to a project photo and HTML descriptions.
Styling is isolated in `assets/css/tapper-exploded.css`; bilingual copy remains
in `assets/js/site-data.js`.

After changes, check scroll forward/backward, manual controls, drag/reset,
language switching, mobile layout, and failed asset loading.

## CU-Brick assembly viewer

`yes.html#cu-brick-explorer` provides a simplified whole-robot view and a CAD-derived
end-effector close-up. The local Three.js module and 599 KB GLB load near the viewport.
Visitors can orbit by dragging or using arrow keys, zoom with buttons or +/- keys,
select meshes or component names, and separate five intact end-effector functions
with the slider: support, power/control, rotation, gripping/release and vision.
Small hardware stays with its module and the sample brick stays in the jaws;
the assembled geometry and finishes are retained during separation. Whole-robot view has a
synchronized 70–220% zoom slider and raises the four lower pulleys and the pick-up
carriage; all eight cables stay attached while the display changes. The site plan
uses saved SolidWorks placements; dimensions and operating strokes are illustrative.

The whole-robot viewer also has a 21.7-second bricklaying cycle: the TX2-60 arm
collects a brick from the conveyor, sets it on the pick-up pole, and retracts.
The pole presents it to the cable-driven end effector, which closes its jaws,
lifts, travels, rotates, lowers and releases it onto the wall. All eight cable
endpoints follow the frame. Play/pause, replay, reset, a scrub timeline and four
stage shortcuts control the same reversible sequence. Focus action frames the
transfer area from the open side; users can return to the full-site view.
Playback starts when the scene scrolls into view, resumes on re-entry, and replays
completed cycles on re-entry. Reduced motion uses discrete stage advancement.
Playback pauses when switching
model views, scrolling the explorer out of view or hiding the browser tab.

`assets/js/cu-brick-model.js` owns geometry/grouping, while
`assets/js/cu-brick-sequence.js` owns the deterministic site cycle and simplified
transfer arm, and `assets/js/cu-brick-exploded.js` owns rendering and controls. Styles are scoped in
`assets/css/cu-brick-exploded.css`. English and Traditional Chinese copy stays in
`assets/js/site-data.js`. The explorer is outside the generated project-content
block so language changes retain the renderer and current interaction state.

Rendering is on demand. Reduced motion disables pose tweening, vertical touch
gestures keep page scrolling, and mobile controls stack below the scene. Model,
module or WebGL failure leaves a project photo and readable system description.
Hardware finishes follow the supplied photos: silver metal, orange printed parts,
blue battery, black electronics and red-brown brick.
The viewer follows the site's light/dark switch, adapting controls, lighting,
the site grid and cable contrast while preserving the current pose and selection.
Only the selected component gets an exterior name and fine leader; no numbered
overlays cover the CAD. On phones, a native component selector above the model
replaces the desktop list. The annotation rail remains outside the canvas at any zoom.
See `assets/models/README.md` for the CAD/photo provenance, simplifications and
rebuild command. The original CAD and reference files are not published.

Checks after editing:

```powershell
node scripts/check-cu-brick-model.mjs
node generate-blog-index.js --check
node generate-site-content.js --check
node scripts/check-static-site.js
```

In a browser also verify both views, assembled/exploded reversal, elevation, cycle
play/pause/replay, reverse scrubbing, all brick handoffs and moving cable spans,
selection by list/mesh, the single exterior annotation, orbit/reset, zoom, English/Chinese, both themes,
mobile scrolling, reduced motion, and the failed-model fallback.

## Automatic Blog Listing

This site supports an automatic blog listing generated from Markdown files in the `posts/` directory. Each post should include bilingual titles, categories and summaries together with `date` and `image`. Optional `seoTitle` and `updated` fields provide a shorter search title and an authoritative modification date.

Example front matter:

```
---
title: "My Post Title"
titleZhHant: "文章標題"
date: "2026-06-06"
category: "Conference"
categoryZhHant: "會議"
image: "./assets/images/example.jpg"
summary: "Short summary of the post."
summaryZhHant: "文章摘要。"
updated: "2026-07-21"
seoTitle: "Short search-result title"
---
```

How it works:
- Run the index generator locally to produce `assets/data/posts.json`, static blog pages in `blog/`, and updated sitemap entries:

```powershell
node generate-blog-index.js
node generate-site-content.js
```

- A GitHub Actions workflow (`.github/workflows/update-blog-index.yml`) runs both generators and commits the generated static outputs whenever Markdown posts or canonical site content change on `main`.

Notes:
- If you add or edit posts locally, run both generators before committing (or rely on the workflow to update the generated files after push).
- The homepage contains checked-in blog cards for crawlers and no-JavaScript visitors, then refreshes them from `assets/data/posts.json` when JavaScript is available.
- `404.html` provides a noindex recovery page for unknown GitHub Pages routes.
