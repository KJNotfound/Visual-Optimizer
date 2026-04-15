# Visual Optimizer

A client-side web visual quality analysis tool. Paste your HTML & CSS, and instantly get a scored report covering color contrast, typography, spacing consistency, and accessibility — with actionable fix suggestions.

## Features

- **Color Contrast** — Checks text-to-background contrast against WCAG 2.1 (AA level: normal text >= 4.5:1, large text >= 3:1)
- **Typography** — Validates heading hierarchy, font family count (<= 3), line-height ratio (1.4–1.8), and minimum font size (>= 12px)
- **Spacing Consistency** — Detects whether margin/padding values follow a 4px grid system
- **Accessibility** — Checks image `alt` attributes, meaningful link text, form label association, and touch target size (>= 44x44px)

## Prerequisites

| Tool    | Minimum | Recommended |
|---------|---------|-------------|
| Node.js | 18.0+   | 22.x        |
| npm     | 9.0+    | 10.x        |

Verify your versions:

```bash
node -v
npm -v
```

Don't have Node.js? Download the LTS version from [nodejs.org](https://nodejs.org) — npm is included.

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/KJNotfound/VibeCoding.git
cd VibeCoding

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

## Other Commands

```bash
npm run build      # Production build → dist/
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint
```

## Usage

1. Open the app and click **Start Analyzing**
2. Paste your HTML and CSS in the editors (or click **Load Sample** for a built-in demo)
3. The right panel shows a live preview
4. Click **Start Analyzing** — the report page opens automatically
5. Review your overall score, per-category scores, issue details, and one-click-copy CSS fixes

## Tech Stack

| Category         | Technology     |
|------------------|----------------|
| Framework        | React 19       |
| Language         | TypeScript 6   |
| Build Tool       | Vite 8         |
| Styling          | Tailwind CSS 4 |
| State Management | Zustand 5      |
| Routing          | React Router 7 |
| Icons            | Lucide React   |

## Project Structure

```
src/
├── engine/              # Analysis engine
│   ├── analyzer.ts      # Entry point: parse → rules → score
│   ├── parser.ts        # HTML/CSS parser (iframe sandbox)
│   ├── scorer.ts        # Weighted scoring system
│   └── rules/           # Detection rules
│       ├── index.ts
│       ├── types.ts
│       ├── color-contrast.ts
│       ├── font-hierarchy.ts
│       ├── spacing-consistency.ts
│       └── accessibility.ts
├── pages/               # Page components
│   ├── HomePage.tsx
│   ├── AnalyzePage.tsx
│   └── ReportPage.tsx
├── components/ui/       # UI primitives (shadcn/ui style)
├── store/               # Zustand store
├── types/               # Global TypeScript types
├── lib/                 # Utility functions
├── App.tsx              # Root component + routing
├── main.tsx             # App entry point
└── index.css            # Global styles + Tailwind theme
```

## FAQ

**Port already in use?**
Run `npx vite --port 3000`, or set `server.port` in `vite.config.ts`.

**How does the analysis engine work?**
It creates a hidden iframe sandbox in the browser, writes your HTML/CSS into it for real rendering, reads computed styles via `getComputedStyle`, then runs each detection rule. Everything happens client-side — no code is uploaded to any server.

## License

MIT
