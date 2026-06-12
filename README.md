
# Personal Website

[![view - Site](https://img.shields.io/badge/View-Personal_website-blue)](https://leocml.com)

This website is based on [vCard - Personal portfolio](https://github.com/codewithsadee/vcard-personal-portfolio.git)

This repository was forked (then detached) from the [vCard - Personal portfolio](https://github.com/codewithsadee/vcard-personal-portfolio.git) by [codewithsadee](https://github.com/codewithsadee), which is released under the MIT License (see LICENSE).

## License

MIT

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

```bash
node generate-blog-index.js
```

- A GitHub Actions workflow (`.github/workflows/update-blog-index.yml`) will automatically run the generator and commit generated blog SEO files whenever Markdown files under `posts/` are pushed to `main`.

Notes:
- If you add or edit posts locally, run the generator before committing (or rely on the workflow to update the index after push).
- The homepage dynamically fetches `assets/data/posts.json` and links each card to its generated static blog page.
