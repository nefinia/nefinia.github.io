# Nançay Radio Observatory Website

Interactive bilingual Vite website for the Nançay Radio Observatory outreach guide.

## Run locally

```bash
npm install
npm run dev
```

Local URL:

```text
http://127.0.0.1:4173/
```

## Build static files

```bash
npm run build
```

The static website is generated in `dist/`. It can be copied into a GitHub Pages site or linked from a larger website.

The Vite config uses `base: "./"` so the built files work from a subfolder such as `/nancay/`.
