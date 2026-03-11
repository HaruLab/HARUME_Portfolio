# HARUME Portfolio (Astro)

## Commands

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Preview production build |
| `npm run deploy` | Build + publish `./dist` to `gh-pages` branch |

## Deploy (GitHub Pages)

- This site is served from the `gh-pages` branch.
- Pushing to `main` alone does **not** update the site unless you also deploy.
- GitHub Actions workflow: `.github/workflows/deploy-gh-pages.yml` deploys automatically on push to `main`.
