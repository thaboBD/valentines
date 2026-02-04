# 💌 Valentine's Day Envelope Experience

A production-ready romantic single-page website featuring an animated envelope that reveals a video montage, with a time-locked countdown to Valentine's Day 2026 (Australia/Sydney timezone).

## ✨ Features

- **Time-Locked Countdown**: Envelope cannot be opened until Valentine's Day 2026 at 00:00:00 in Australia/Sydney timezone
- **Smooth GSAP Animations**: Premium envelope opening and letter slide-out animations
- **Video Montage**: Embedded video playback with mobile support (iOS Safari compatible)
- **Rose Explosion**: Celebratory confetti effect with rose emoji particles
- **Fully Responsive**: Works seamlessly on mobile and desktop
- **Accessibility**: Keyboard navigation and reduced motion support
- **GitHub Pages Ready**: Configured for easy deployment

## 🛠️ Tech Stack

- **Vite** - Fast build tool and dev server
- **Vanilla JavaScript** - No heavy frameworks
- **GSAP** - Professional-grade animations
- **Luxon** - Reliable timezone handling
- **canvas-confetti** - Celebration effects

## 📁 Project Structure

```
valentine-envelope/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── public/
│   └── heart.svg               # Favicon
├── src/
│   ├── assets/
│   │   ├── video/
│   │   │   └── montage.mp4     # YOUR VIDEO GOES HERE
│   │   └── img/                # Optional images
│   ├── components/
│   │   ├── countdown.js        # Countdown timer logic
│   │   ├── animations.js       # GSAP animation sequences
│   │   └── roses.js            # Rose explosion effect
│   ├── main.js                 # Main application logic
│   └── style.css               # All styles
├── index.html                  # Main HTML file
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (recommended)
- npm or yarn

### Installation

1. **Clone or download this repository**

```bash
cd valentine-envelope
```

2. **Install dependencies**

```bash
npm install
```

3. **Add your video montage**

Place your video file at:
```
public/video/montage.mp4
```

**Important**: The video should be in MP4 format. For best results:
- Use H.264 codec for compatibility
- Optimize file size (current config assumes ~95MB)
- Include audio in the video file

### Development

**Run the development server:**

```bash
npm run dev
```

The app will open at `http://localhost:3000`

**Development features:**
- Hot module replacement
- Debug helpers in console (type `valentineDebug`)
- Skip to any state for testing

**Debug commands** (available in browser console):
```javascript
valentineDebug.skipToUnlocked()  // Skip countdown
valentineDebug.skipToQuestion()  // Go to question state
valentineDebug.skipToFinal()     // Go to final message
valentineDebug.triggerRoses()    // Test rose explosion
valentineDebug.getTimeRemaining() // Check countdown
```

### Build

**Create a production build:**

```bash
npm run build
```

This generates optimized static files in the `dist/` folder.

**Preview the production build locally:**

```bash
npm run preview
```

## 🌐 Deployment to GitHub Pages

There are two methods to deploy to GitHub Pages:

### Method 1: GitHub Actions (Recommended)

This method automatically deploys on every push to the `main` branch.

1. **Update the base path in `vite.config.js`**

```javascript
base: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME/' : '/',
```

Replace `YOUR-REPO-NAME` with your actual GitHub repository name.

2. **Push your code to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

3. **Enable GitHub Pages in repository settings**

- Go to your repository on GitHub
- Navigate to **Settings** → **Pages**
- Under **Source**, select **GitHub Actions**
- The workflow will automatically run and deploy your site

4. **Access your site**

Your site will be available at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
- Run on every push to `main`
- Install dependencies
- Build the project
- Deploy to GitHub Pages automatically

### Method 2: Manual Deployment with gh-pages

If you prefer manual deployment:

1. **Update the base path** (same as Method 1)

2. **Build and deploy:**

```bash
npm run build
npm run deploy
```

This uses the `gh-pages` package to deploy the `dist/` folder to the `gh-pages` branch.

3. **Configure GitHub Pages:**

- Go to **Settings** → **Pages**
- Set source to **gh-pages** branch
- Save

## ⚙️ Configuration

### Countdown Target Date

The countdown is set to Valentine's Day 2026 in Australia/Sydney timezone.

To change this, edit `src/components/countdown.js`:

```javascript
this.targetDate = DateTime.fromObject(
  {
    year: 2026,      // Change year
    month: 2,        // Change month (1-12)
    day: 14,         // Change day
    hour: 0,
    minute: 0,
    second: 0,
  },
  { zone: 'Australia/Sydney' }  // Change timezone
);
```

### Video Retraction Time

The letter retracts at 24 seconds by default. To change this, edit `src/main.js`:

```javascript
const CONFIG = {
  videoRetractTime: 24,  // Change this value (in seconds)
  keepAudioPlaying: true,
};
```

### Colors and Styling

All colors and styles are in `src/style.css`. CSS variables are defined at the top:

```css
:root {
  --color-navy-dark: #0d1b2a;
  --color-candlelight: #e0ac69;
  --color-rose: #ff6b9d;
  /* ... edit these */
}
```

### Text Content

To change the names or messages:

1. **"To Simomo"** - Edit in `index.html` (line 23 and 62)
2. **Lock message** - Edit in `index.html` (line 30)
3. **Question** - Edit in `index.html` (line 95)
4. **Final message** - Edit in `index.html` (lines 106-107)

## 📱 Mobile Support

The site is fully responsive and works on:
- iOS Safari (with playsinline support)
- Android Chrome
- Desktop browsers

**iOS-specific features:**
- `playsinline` attribute prevents fullscreen video
- Video starts on user gesture (click) to satisfy autoplay policies
- Touch-friendly button sizes

## ♿ Accessibility

- Keyboard navigation supported (Tab, Enter, Space)
- ARIA labels on interactive elements
- Respects `prefers-reduced-motion` setting
- Large tap targets for mobile
- Focus visible indicators

## 🐛 Troubleshooting

### Video not playing on iOS

- Ensure video has `playsinline` attribute (already included)
- Video must start on user interaction (click) - this is implemented
- Use H.264 codec for best compatibility

### Countdown showing wrong time

- The app uses Luxon with `Australia/Sydney` timezone
- Client-side time can be changed by user (this is a client-side lock only)
- Check browser console for timezone info

### Deployment base path issues

- Ensure `base` in `vite.config.js` matches your repo name
- Format: `/repo-name/` (with leading and trailing slashes)
- For custom domain, set `base: '/'`

### GitHub Actions not deploying

- Check **Settings** → **Pages** → Source is set to **GitHub Actions**
- Check **Settings** → **Actions** → **General** → Workflow permissions are set to "Read and write"
- Check the Actions tab for error logs

## 📄 License

This project is provided as-is for personal use.

## 💝 Credits

Built with love using modern web technologies.

---

**Note**: Remember to add your video file to `src/assets/video/montage.mp4` before deploying!
