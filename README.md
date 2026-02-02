# Beer With Me Wrapped 🍺

A beautiful, mobile-first web application that creates "Wrapped" style visualizations from your Beer With Me app data.

![Beer With Me Wrapped](https://img.shields.io/badge/Made%20with-🍺-yellow)

## Features

- **📊 Timeline Chart**: See your drinks over time with color-coded lines for each drink type
- **🍩 Drink Distribution**: Donut chart showing your drink preferences
- **🔥 Drinking Patterns Heatmap**: Discover when you drink most (day × hour)
- **📈 Monthly Activity**: Bar chart of drinks per month
- **📍 Top Locations**: Your most frequented drinking spots
- **✨ Fun Facts**: Streaks, records, and averages

## Privacy First

**Your data never leaves your device.** All processing happens locally in your browser - nothing is uploaded to any server.

## How to Use

1. Open the website
2. Upload your `history_all.json` file from Beer With Me
3. Explore your personalized drinking statistics!

### Getting Your Data

To export your data from Beer With Me:
1. Open Beer With Me app
2. Go to Settings → Export Data
3. Save the `history_all.json` file

## Demo

Visit the live demo: [https://lennartP-sch.github.io/BeerWithMeWrapped/](https://lennartp-sch.github.io/BeerWithMeWrapped/)

## Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Custom design system with CSS variables
- **Vanilla JavaScript** - No frameworks needed
- **Chart.js** - Beautiful, responsive charts

## Local Development

Simply open `index.html` in your browser, or run a local server:

```bash
# Python
python -m http.server 3000

# Node.js
npx serve .
```

Then visit `http://localhost:3000`

## Design

- 🌙 Dark theme with beer amber/gold accents
- 💫 Glassmorphism cards with subtle blur
- ✨ Smooth animations and micro-interactions
- 📱 Mobile-first, fully responsive

## License

MIT License - Feel free to use and modify!

---

Made with 🍺 for the Beer With Me community
