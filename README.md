# Personal Running Dashboard

A modern, responsive, single-page running dashboard designed for athletes to visualize activities, track goals, and celebrate progress.

Built with **React 19**, **Vite**, **Tailwind CSS**, and **Mapbox GL**. Automatically synchronized with **Intervals.icu** via GitHub Actions.

🌐 **Live Site**: [https://run.gengniu.org](https://run.gengniu.org)

---

## Features

- **Single-Page Modern Dashboard**: High-density, clutter-free layout displaying all essential metrics without page transitions.
- **Weekly, Monthly & Annual Goals**:
  - Weekly goal progress bar (starting from Sunday through Saturday).
  - Consecutive active streak tracking.
  - Monthly and annual distance progression.
- **Interactive Route Map**:
  - Powered by Mapbox GL with light and dark tile styling.
  - Interactive activity route highlighting and state-level filtering.
- **GitHub-style Heatmap**:
  - Visual activity calendar for every day of the year.
  - Hover tooltips with distance, pace, and time.
  - One-click PNG image export.
- **Activity Log**:
  - Paginated activity list with distance filters (All, 10km+, 20km+, 40km+).
  - Detailed metrics: distance, moving time, pace, elevation gain, date/time.
- **Personal Bests (PRs)**: Automatically detects and highlights best times for 5K, 10K, Half Marathon, and Full Marathon.
- **Track Gallery & Calendar**: Full-width track wall visualization and monthly calendar view.
- **Dark / Light Theme & Localization**: Supports Dark, Light, or System mode with English and Chinese localization.

---

## Quick Configuration (`config.yml`)

All user configurations are located in `config.yml` at the project root:

```yaml
# config.yml

# Mapbox token (optional if set via MAPBOX_TOKEN secret in GitHub Actions)
mapbox_token: ''

# Profile avatar URL
avatar: 'https://img.gengniu.org/2026/08/cc3b3ad9.jpg'

# Default language: en | zh
locale: en

# Default theme: system | light | dark
theme: system

# Dashboard theme
theme_preset: dashboard

# Running distance targets (unit: distance in km)
goals:
  all:
    yearly: 2000
    monthly: 150
    weekly: 35
    unit: distance
  Run:
    yearly: 2000
    monthly: 150
    weekly: 35
    unit: distance
```

---

## Data Synchronization

Data is automatically synchronized using GitHub Actions. The primary data source is **Intervals.icu**.

### 1. Intervals.icu (Primary)

1. Obtain your **Athlete ID** and **API Key** from [Intervals.icu](https://intervals.icu) under **Settings** &rarr; **Developer Settings**.
2. Add the following repository secrets under **Settings &rarr; Secrets and variables &rarr; Actions**:
   - `INTERVALS_ICU_ATHLETE_ID`
   - `INTERVALS_ICU_API_KEY`
   - `MAPBOX_TOKEN`
3. The workflow `.github/workflows/run_data_sync.yml` automatically triggers daily at midnight UTC, or can be run manually via the **Run workflow** button.

#### Local Sync:
```bash
python run_page/intervals_icu_sync.py <athlete_id> <api_key>
```

### 2. Manual / Local GPX & FIT Imports

If you have standalone activity files:

- **GPX files**: Place files in `GPX_OUT/` and run:
  ```bash
  python run_page/gpx_sync.py
  ```
- **FIT files**: Place files in `FIT_OUT/` and run:
  ```bash
  python run_page/fit_sync.py
  ```

---

## Local Development

### Prerequisites

- **Node.js**: &gt;= 20.x
- **Python**: &gt;= 3.11
- **Package Manager**: [pnpm](https://pnpm.io/) (`corepack enable pnpm`)

### Setup & Run

1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Install Frontend dependencies**:
   ```bash
   pnpm install
   ```

3. **Start local development server**:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Production Build**:
   ```bash
   pnpm build
   ```

5. **Linting & Code Formatting**:
   ```bash
   pnpm run check        # Check formatting with Prettier
   pnpm run lint         # Lint frontend with ESLint
   black . --check       # Check Python formatting with Black
   ruff check .          # Lint Python with Ruff
   ```

---

## Deployment

### GitHub Pages (Automated)

The project is configured for automated build and deployment to GitHub Pages via `.github/workflows/gh-pages.yml`:

1. When `run_data_sync.yml` completes syncing activity data, it triggers `gh-pages.yml`.
2. The workflow builds the static bundle and deploys it to GitHub Pages.
3. Custom domain: configured for `run.gengniu.org`.

---

## License

MIT License.
