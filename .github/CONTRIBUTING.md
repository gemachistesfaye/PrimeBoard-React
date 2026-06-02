# Contributing to Prime Board

Thank you for considering a contribution! Every improvement — no matter how small — makes this project better for everyone.

## Before you start

- Check the [open issues](https://github.com/gemachistesfaye/PrimeBoard-React/issues) to see if your idea or bug is already tracked.
- For large changes, open a [Feature Request](ISSUE_TEMPLATE/feature_request.md) first so we can discuss the approach before you invest time coding.

## Development workflow

### 1. Fork and clone

```bash
git clone https://github.com/your-username/PrimeBoard-React.git
cd PrimeBoard-React
```

### 2. Create a feature branch

```bash
# For new features:
git checkout -b feature/your-feature-name

# For bug fixes:
git checkout -b fix/short-bug-description
```

### 3. Install dependencies and start dev server

```bash
npm install
npm run dev
```

### 4. Make your changes

- Use **Tailwind CSS utility classes** for all styling
- Preserve **dark mode** — every new component must include `dark:` variant classes
- Use **Lucide React** for all icons — do not add new icon libraries
- Keep components small and focused — one responsibility per component

### 5. Lint before committing

```bash
npm run lint
```

### 6. Commit with a clear message

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add GPA trend chart to analytics page"
git commit -m "fix: sidebar collapses correctly on mobile"
git commit -m "docs: update README installation steps"
```

### 7. Push and open a Pull Request

```bash
git push origin feature/your-feature-name
```

## Code style

| Rule | Convention |
|------|-----------|
| Component filenames | `PascalCase.jsx` |
| Variables and functions | `camelCase` |
| Styling | Tailwind utility classes only |
| Icons | Lucide React only |
| Commits | Conventional Commits format |

## What makes a good PR

- Solves exactly one problem or adds one feature
- Includes a screenshot or GIF if the change affects the UI
- Does not break dark mode or mobile responsiveness
- Passes `npm run lint` with no errors