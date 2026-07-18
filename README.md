
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

The generators update the shared profile shell and translated fallbacks on the homepage, project pages, the legacy blog page, and generated blog pages. They also keep project URLs, sitemap entries, page and social metadata, JSON-LD catalog data, and English detail bodies aligned with the same project registry. Do not edit generated project `.project-content` blocks directly.

To verify that checked-in HTML is current without writing files:

```powershell
node generate-site-content.js --check
```

## Visual System

Portfolio pages use `assets/css/style.css` as the legacy component base and
`assets/css/field-notes.css` as the scoped responsive design layer. The latter
only applies inside `body.portfolio-site`, keeping `dashboard.html` isolated.
Homepage project-rail behavior lives in
`assets/css/custom_project_preview.css` and is user-controlled with native
horizontal scrolling and scroll snap rather than automatic animation.

When adding a new portfolio or blog template, include the `portfolio-site`
body class and load `field-notes.css` after `style.css`. Generated blog pages
inherit both from `generate-blog-index.js`.

## Automatic Blog Listing

This site now supports an automatic blog listing generated from Markdown files in the `posts/` directory. Each post should include YAML front matter with metadata such as `title`, `date`, `category`, `image` and optional `summary`.

Example front matter:

```
---
title: "My Post Title"
date: "2026-06-06"
category: "Conference"
image: "./assets/images/example.jpg"
summary: "Short summary of the post."
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
- The homepage dynamically fetches `assets/data/posts.json` and links each card to its generated static blog page.
