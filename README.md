# 🏋️ HEFT – Workout Tracker

A mobile-first PWA for tracking weight training workouts, routines, and progress over time.

## Features
- Log daily workouts with exercises, sets, weight (kg), and reps
- Create and load routines
- Custom exercise library
- Personal best detection
- 3-month progress charts
- Works offline (PWA)
- Data stored locally in your browser via localStorage

---

## 🚀 Deploy to GitHub Pages (free)

### 1. Create a GitHub repository
- Go to [github.com](https://github.com) → New repository
- Name it `heft` (or anything you like)
- Set it to **Public**
- Click **Create repository**

### 2. Push this project
```bash
cd heft
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 3. Enable GitHub Pages
- Go to your repo → **Settings** → **Pages**
- Under *Source*, select **GitHub Actions**
- The workflow will auto-run and deploy your app

### 4. Access your app
Your app will be live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

---

## 📱 Add to Home Screen (mobile)

**iPhone (Safari):**
1. Open your GitHub Pages URL in Safari
2. Tap the Share button → **Add to Home Screen**
3. Tap **Add** — it'll appear as an app icon

**Android (Chrome):**
1. Open your GitHub Pages URL in Chrome
2. Tap the three-dot menu → **Add to Home Screen**
3. Tap **Add**

---

## 🛠 Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
```

Output goes to the `dist/` folder.

---

## 📦 Tech Stack
- React 18
- Vite
- Recharts (progress charts)
- vite-plugin-pwa (offline support + installable)
- localStorage (no backend needed)
