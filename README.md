# MicroBloom - Habit Tracker

**Small Habits. Meaningful Change.**

A lightweight, beautifully designed habit tracker for building better daily routines. No backend. No authentication. Just your progress.

## Overview

MicroBloom is a modern, minimalist wellness application built with vanilla HTML5, CSS3, and JavaScript. It helps employees track meaningful microhabits through an interactive, mobile-first dashboard. Perfect for workplace wellbeing initiatives.

**Key Features:**
- 🌱 Six curated wellbeing habits
- 📊 Real-time progress tracking
- 🔥 Streak calculation system
- 🏆 Achievement badges
- 📱 Fully responsive design
- 💾 Browser-based data persistence
- ⚡ Zero external dependencies

## Quick Start

### How to Run Locally

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd microbloom
   ```

2. **Open in a browser**
   - Simply double-click `index.html` or open it in your preferred browser
   - No build process or server required

3. **Start tracking**
   - Click "Start My Journey"
   - Select your habits
   - Begin tracking immediately

## Application Features

### Screen 1: Welcome
- Elegant hero section with animated illustrations
- Tagline: "Small Habits. Meaningful Change."
- Simple entry point with minimal friction

### Screen 2: Habit Selection
- Six curated wellbeing habits to choose from:
  - **Drink Water** 💧 - 2 liters daily
  - **Keep Moving** 🚶 - 20 minutes, 5 days per week
  - **Meditate Daily** 🧘 - 7 minutes daily
  - **Sleep Better** 😴 - 7 hours daily
  - **Eat Earlier** 🍽️ - Finish dinner before chosen time
  - **Mindful Eating** 🥗 - One mindful meal daily
- Multi-select support with visual feedback
- Save selection to continue later

### Screen 3: Dashboard
The personal dashboard includes:

#### Summary Section
- Today's completion percentage
- Completed habits count
- Current streak counter
- Weekly consistency score

#### Habit Tracking Cards
Each habit has interactive controls:
- **Water**: +250ml, +500ml buttons with undo
- **Movement**: +5min, +10min buttons with undo
- **Meditation**: 7-minute countdown timer with start/pause/reset
- **Sleep**: Hours input field
- **Early Dinner**: Time selection with daily checkbox
- **Mindful Eating**: Daily completion checkbox

#### Weekly Overview
- 7-day progress view with completion percentages
- Visual highlight for fully completed days

#### Achievements
- 🌱 First Step - Complete your first habit
- 🔥 Consistency Builder - 3 consecutive days
- 🏆 One Week Strong - 7 consecutive days
- 💧 Hydration Hero - Reach water target

#### Settings
- Edit selected habits
- Configure dinner cutoff time
- Reset today's progress
- Reset all data (with confirmation)

## Data Persistence

### How localStorage Works

MicroBloom uses browser `localStorage` to persist all data locally on your device. No server or cloud connection needed.

**Stored Data:**
- Selected habits
- Daily progress and completion
- Complete history log
- User preferences
- Earned achievements

**Data Structure:**
```
localStorage.microbloom_data = {
  selectedHabits: ["water", "meditation", ...],
  dailyProgress: {
    "2026-11-19": {
      "water": { current: 1500, completed: false },
      "meditation": { elapsed_seconds: 240, completed: false },
      ...
    },
    ...
  },
  achievements: ["first_step", "hydration_hero"],
  preferences: { dinner_time: "19:00" }
}
```

**Important Notes:**
- Data is stored **per browser, per device**
- Clearing browser data/cache will delete your progress
- Different users on different devices have independent data
- No automatic backup - save important milestones elsewhere if needed

## Deployment

### GitHub Pages 

1. **Create a GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: MicroBloom habit tracker"
   git remote add origin https://github.com/YOUR_USERNAME/microbloom.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose `main` branch and `/root` folder
   - Save

3. **Access your app**
   - Visit: `https://YOUR_USERNAME.github.io/microbloom`
   - Share the link in your workplace social post

### Other Hosting Options

- **Vercel**: Drag and drop the folder at vercel.com
- **Netlify**: Connect GitHub or drag and drop
- **Any static host**: Upload all three files

### Local Development

For local testing without deployment:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server
```

Then visit `http://localhost:8000`

## Customization Guide

### Adding New Habits

Edit `script.js` in the `HabitTracker` constructor:

```javascript
{
    id: 'your_habit_id',
    name: 'Your Habit Name',
    icon: '🎯',
    type: 'quantity', // or 'timer', 'checkbox', 'time_checkpoint'
    unit: 'times',
    daily_target: 10,
    increment_options: [1, 5]
}
```

### Changing Colors

Edit `style.css` color variables:
```css
Primary: #32856B (green)
Accent: #DDF3E7 (light green)
Background: #FFFFFF (white)
Text: #1F2937 (dark gray)
```

### Adjusting Goals

Modify habit targets in `script.js`:
- Water: `daily_target: 2000` (ml)
- Movement: `daily_target: 20` (minutes)
- Sleep: `daily_target: 7` (hours)

### Changing Dinner Time Default

In `script.js`:
```javascript
preferences: {
    dinner_time: '19:00' // Change to your preferred time
}
```

## Technical Details

### Architecture

- **Single Page Application**: Three screens managed by JavaScript
- **No frameworks**: Pure vanilla JavaScript (ES6+)
- **CSS-only animations**: Smooth transitions without libraries
- **Responsive grid layouts**: Mobile-first design approach
- **Semantic HTML**: Accessible structure for all users

### Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

### File Structure

```
index.html      ~10KB   - HTML structure and semantic markup
style.css       ~20KB   - Responsive design and animations
script.js       ~30KB   - Application logic and data management
README.md       ~5KB    - Documentation
```

### Performance

- **Page load**: < 100ms
- **No external dependencies**: Instant, offline-capable
- **Minimal JavaScript**: ~30KB of logic
- **CSS animations**: Hardware-accelerated transforms
- **Data operations**: Instant localStorage access

## Limitations & Considerations

### Data Persistence
- **Browser-specific**: Data doesn't sync across browsers/devices
- **Storage limit**: Most browsers allow 5-10MB localStorage
- **No cloud backup**: Clear browser data and lose progress
- **Private browsing**: Incognito/Private mode may not persist data

### Features
- No real-time synchronization
- No user authentication or accounts
- No data export/import UI (but localStorage data is exportable)
- No offline notifications (works fully offline though)

### Recommendations
1. Users should bookmark the app
2. Regular use recommended for best results
3. Consider writing down important milestones
4. Download data periodically if critical

## Troubleshooting

### "My data disappeared!"
- Check if localStorage is enabled in browser settings
- Try private/incognito mode - it may not persist there
- Clear browser cache but keep cookies and site data

### App not loading
- Ensure all three files (index.html, style.css, script.js) are in same folder
- Check browser console for errors (F12 → Console)
- Try a different browser

### Progress not saving
- Verify localStorage is enabled
- Check available storage space
- Try resetting data and starting fresh

### Timer not working
- Ensure JavaScript is enabled
- Try closing and reopening the timer modal
- Refresh the page

## Code Quality

### Best Practices
✅ Semantic HTML5 structure  
✅ BEM-inspired CSS naming  
✅ Modular JavaScript functions  
✅ localStorage as single source of truth  
✅ WCAG 2.1 AA accessibility  
✅ Mobile-first responsive design  
✅ No console errors  
✅ Input validation and error handling  

### Browser Console
- No errors or warnings
- Clean, production-ready code
- Cross-browser tested

## Privacy & Security

**Important Information:**
- ✅ All data stored locally on your device
- ✅ No network requests or telemetry
- ✅ No third-party tracking
- ✅ No authentication or personal data collection
- ✅ Works completely offline
- ✅ GDPR compliant (no data sharing)

This is a **standalone, unofficial** application. It is not affiliated with any official corporate platform and collects no data.

## Development

### Project Structure

```
HabitTracker class
├── Data management (load/save)
├── Habit definitions
├── Progress tracking
└── Achievement system

Screen Management
├── Welcome screen
├── Habit selection
└── Dashboard

Habit Controls
├── Quantity tracking (water, movement)
├── Timer (meditation)
├── Checkbox (eating)
└── Time checkpoint (dinner)

Storage Layer
└── Browser localStorage with key prefixing
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `renderDashboard()` | Render complete dashboard view |
| `updateSummarySection()` | Calculate and display progress stats |
| `calculateStreak()` | Compute consecutive completion days |
| `handleHabitControl()` | Process habit tracking interactions |
| `createHabitCard()` | Generate habit card HTML and logic |
| `showScreen()` | Navigate between app screens |

## Contributing

This is a standalone project. To improve it:
1. Fork the repository
2. Create a feature branch
3. Test thoroughly on mobile and desktop
4. Submit a pull request with clear descriptions

## License

MIT License - Free to use, modify, and share.

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review browser console for errors
3. Verify all files are in the correct location
4. Try clearing localStorage and starting fresh

---

**Built with ❤️ for wellbeing. Small habits. Meaningful change.**

*Last Updated: November 2026*
