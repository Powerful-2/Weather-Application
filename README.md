# Mobile Weather Dashboard

## Responsive mobile weather application built using professional Figma design specifications and powered by real-time climate data from the Open-Meteo API.

Features Built (Mobile View)

- Live Search Bar: Translates text city inputs into exact map coordinates instantly.
- Dynamic 7-Day Outlook Grid: Automatically updates upcoming weekdays and weather metrics.
- 6-Hour Interactive Timeline: Updates layout rows based on your current local hour line.
- Smart Icon Selection: Automatically matches server weather condition codes to matching image folder assets.
- Cache Memory Management: Downloads a weekly data bundle all at once so switching dropdown filters updates the screen instantly without reloading.

---

## Challenges Overcome

1. Frozen Data Placeholders(Boilerplate Nodes): Cleared out hardcoded Frontend Mentor starter rows (`20, 20, 20, 18, 18, 18`) and forced the browser to rebuild layout rows dynamically.
2. Duplicate Variable Crashes: Sandboxed the engine script inside a private IIFE function loop to stop live reloading tools from crashing the `searchForm` declaration.
3. Missing NodeList Grids: Fixed an index bug (`detailValues`) by assigning values to ordered array boxes `[0]` through `[3]` individually instead of breaking the entire array text node list.

---

## Tech Stack Used

- HTML5: Structured semantic landmarks and flexible container elements.
- CSS3: Flexbox layouts, dynamic grid equations, custom dropdown styles, and theme color profiles.
- JavaScript (ES6+): Asynchronous Fetch API loops, JSON data mapping, and localized event handling.

---

## How to Run the Project Locally

1. Clone this repository to your machine.
2. Open the project folder using VS Code.
3. Right-click on your `weather.html` file and click `Open with Live Server`.
4. Type any major city (like Surulere, Lagos, or London) into the search bar and press Enter.

## How the App Uses the Open-Meteo APIs

Instead of trying to find weather data directly from a plain text city name (which computers cannot do), this application splits the workflow into two intelligent server pipelines:

### 1. Open-Meteo Geocoding API

- **What it does**: It acts as a digital map translator [INDEX].
- **How the app uses it**: The moment you type a city name (like "Surulere") and hit search, this API takes that text string and translates it into an exact geographical coordinate pair—Latitude and Longitude. It also returns the formatted name and country to clean up the headline display.
- The Live Endpoint Path:
  ```text
  https://open-meteo.com
  ```

### 2. Open-Meteo Forecast API

- What it does: It acts as the core meteorological database engine.
- How the app uses it: The script immediately feeds the newly calculated Latitude and Longitude coordinates straight into this second API. The forecast server reads those coordinates and returns a massive synchronized payload bundle containing current telemetry, a 7-day daily outlook, and a 168-hour timeline array.
- The Live Endpoint Path:
  ```text
  https://open-meteo.com
  ```

---

## Problems Encountered & Practical Solutions

### 1. The Broken NodeList Text Glitch

- The Problem: The app grid values froze because we tried to apply a single text value directly to a collection list (`detailValues.textContent = ...`). The browser did not know which individual card to update.
- The Practical Solution: We targeted each grid box index number explicitly using array bracket notation (`, `, `, `) [INDEX].
- Code Example:
  _javascript _//
  // ❌ BROKEN APPROACH
  detailValues.textContent = `${Math.round(cur.apparent_temperature)}°`;

  // FIXED SOLUTION
  detailValues[0].textContent = `${Math.round(cur.apparent_temperature)}°`; // Card 1: Feels Like
  detailValues[1].textContent = `${Math.round(cur.relative_humidity_2m)}%`; // Card 2: Humidity
  detailValues[2].textContent = `${Math.round(cur.wind_speed_10m)} km/h`; // Card 3: Wind Speed
  detailValues[3].textContent = `${cur.precipitation} mm`; // Card 4: Precipitation

  ```

  ```

### 2. Live Reload Variable Redeclaration Crash

- The Problem: VS Code Live Server extension tool updates forced the browser to re-read the script file twice, causing a fatal crash: `Uncaught SyntaxError: Identifier 'searchForm' has already been declared`.
- The Practical Solution: We wrapped all logic inside an IIFE Immediately Invoked Function Expression to sandbox variables away from global browser conflict zones and added a `defer` loading attribute to the HTML script tag.
- //Code Example//:
  ```javascript
  // FIXED SOLUTION: Sandbox Scope Isolation
  (function () {
    "use strict";
    const searchForm = document.querySelector(".search-container");
    // All logic sits safely in here and can never collide!
  })();
  ```

### 3. Missing Dropdown Synchronous Memory Scope

- The Problem: Clicking the dropdown hours after a search failed to change the hourly row data because the initial API function's internal variable tracker (`weatherData`) vanished from memory after finishing.
- The Practical Solution: We built a global runtime pointer variable (`let globalWeatherData = null;`) that acts as an in-memory cache backpack [INDEX, INDEX].
- Code Example:

  ```javascript
  // ✅ FIXED SOLUTION: Persistent Memory Loop
  let globalWeatherData = null; // Shared memory vault

  async function getLiveWeather(city) {
    const weatherData = await weatherRes.json();
    globalWeatherData = weatherData; // Save to backpack for later use
  }

  daySelector.addEventListener("change", (event) => {
    // Reaches into the backpack instantly without needing an internet call
    const hourlyData = globalWeatherData.hourly;
  });
  ```

### 4. Broken API Request URLs (ERR_NAME_NOT_RESOLVED)

- The Problem: Highlighting the API link text literal paths directly from VS Code text elements broke during testing because it was missing sub-directories (`/v1/search`), parameters, and the dollar sign prefix symbol (`$`) on the template parameters.
- The Practical Solution: Cleaned up the template backtick paths, normalized casing anomalies (`encodeURIComponent`), and structured endpoints correctly [INDEX].
- Code Example:
  //Javascript//
  // ❌ BROKEN APPROACH
  const geoUrl = `https://open-meteo.com{encodeuricomponent(city)}...`;

  // ✅ FIXED SOLUTION
  const geoUrl = `https://open-meteo.com{encodeURIComponent(city)}&count=1&language=en&format=json`;

---

# Frontend Mentor - Weather app

![Design preview for the Weather app coding challenge](./preview.jpg)

## Welcome! 👋

Thanks for checking out this coding challenge.

[Frontend Mentor](https://www.frontendmentor.io) challenges help you improve your coding skills by building realistic projects.

**To do this challenge, you need a good understanding of HTML, CSS, and JavaScript.**

## The challenge

Build a weather app using the [Open-Meteo API](https://open-meteo.com/) and get it looking as close to the design as possible.

You can use any tools you like to help you complete the challenge. So if you've got something you'd like to practice, feel free to give it a go.

Your users should be able to:

- Search for weather information by entering a location in the search bar
- View current weather conditions including temperature, weather icon, and location details
- See additional weather metrics like "feels like" temperature, humidity percentage, wind speed, and precipitation amounts
- Browse a 7-day weather forecast with daily high/low temperatures and weather icons
- View an hourly forecast showing temperature changes throughout the day
- Switch between different days of the week using the day selector in the hourly forecast section
- Toggle between Imperial and Metric measurement units via the units dropdown
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

## Getting started

### What's included

Your task is to build out the project to the designs inside the `/design` folder. You will find both a mobile and a desktop version of the design.

**In your download:**

- Mobile and desktop designs (JPG format)
- All required assets in the `/assets` folder
- Variable and static font files (or link to Google Fonts)
- `style-guide.md` with colors, fonts, and other design specs

**Want more accurate builds?** The designs are in JPG static format, which means you'll need to use your best judgment for styles such as `font-size`, `padding`, and `margin`. If you'd like the Figma design file to help build a more accurate solution faster, you can [subscribe as a PRO member](https://www.frontendmentor.io/pro).

### API setup

This project uses the [Open-Meteo API](https://open-meteo.com/) to fetch weather data.

**Good news:** Open-Meteo is completely free and doesn't require an API key! You can start making requests right away.

- **API Documentation:** [https://open-meteo.com/en/docs](https://open-meteo.com/en/docs)
- **No rate limits** for reasonable personal use
- Example endpoint: `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true`

Check their documentation for all available weather parameters and location search capabilities.

## Using AI coding assistants

We've included two files to help you if you're using AI coding assistants (like Claude, GitHub Copilot, Cursor, etc.) while working on this challenge:

- `AGENTS.md` - Contains detailed instructions for AI assistants on how to help you with this challenge. It's tailored to this challenge's difficulty level, so the AI will provide guidance appropriate to your learning stage—offering more support for beginner challenges and encouraging more independence on advanced ones.
- `CLAUDE.md` - A pointer file that directs Claude-based tools to the AGENTS.md instructions.

**How to use them:** You don't need to do anything! These files are automatically detected by most AI coding tools. The AI will read them and adjust its behavior to be a better learning partner—guiding you toward solutions rather than just giving you the answers.

**Note:** These files are designed to help you _learn_, not to do the work for you. The AI is instructed to ask questions, give hints, and explain concepts rather than writing complete solutions.

## Building your project

Feel free to use any workflow that you feel comfortable with. Below is a suggested process, but do not feel like you need to follow these steps:

1. Initialize your project as a public repository on [GitHub](https://github.com/). Creating a repo will make it easier to share your code with the community if you need help. If you're not sure how to do this, [have a read-through of this Try Git resource](https://try.github.io/).
2. Configure your repository to publish your code to a web address. This will also be useful if you need some help during a challenge as you can share the URL for your project with your repo URL. There are a number of ways to do this, and we provide some recommendations below.
3. Look through the designs to start planning out how you'll tackle the project. This step is crucial to help you think ahead for CSS classes to create reusable styles.
4. Before adding any styles, structure your content with HTML. Writing your HTML first can help focus your attention on creating well-structured content.
5. Write out the base styles for your project, including general content styles, such as `font-family` and `font-size`.
6. Start adding styles to the top of the page and work down. Only move on to the next section once you're happy you've completed the area you're working on.

### Want some support on the challenge?

[Join our community](https://www.frontendmentor.io/community) and ask questions in the **#help** channel.

## Deploying your project

As mentioned above, there are many ways to host your project for free. Our recommended hosts are:

- [GitHub Pages](https://pages.github.com/)
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)

You can host your site using one of these solutions or any of our other trusted providers. [Read more about our recommended and trusted hosts](https://www.frontendmentor.io/guides/hosting-your-solution).

## Submitting your solution

Submit your solution on the platform for the rest of the community to see. Follow our ["Complete guide to submitting solutions"](https://www.frontendmentor.io/guides/how-to-submit-solutions) for tips on how to do this.

Remember, if you're looking for feedback on your solution, be sure to ask questions when submitting it. The more specific and detailed you are with your questions, the higher the chance you'll get valuable feedback from the community.

**We strongly recommend overwriting this `README.md` with a custom one.** We've provided a template inside the [`README-template.md`](./README-template.md) file in this starter code. The template provides a guide for what to add. A custom `README` will help you explain your project and reflect on your learnings.

## Sharing your solution

There are multiple places you can share your solution:

1. Submit it on the platform and share your solution page in the **#finished-projects** channel of our [community](https://www.frontendmentor.io/community)
2. Share on [X (formerly Twitter)](https://x.com/frontendmentor) and mention **@frontendmentor**, including the repo and live URLs in your post. We'd love to take a look at what you've built and help share it around.
3. Share your solution on [LinkedIn](https://www.linkedin.com/company/frontend-mentor/).
4. Blog about your experience building your project. Writing about your workflow, technical choices, and talking through your code is a brilliant way to reinforce what you've learned. Great platforms to write on are [dev.to](https://dev.to/), [Hashnode](https://hashnode.com/), and [CodeNewbie](https://community.codenewbie.org/).

## Got feedback for us?

We love receiving feedback! We're always looking to improve our challenges and our platform. So if you have anything you'd like to mention, please email hi[at]frontendmentor[dot]io.

**This challenge is completely free. Please share it with anyone who will find it useful for practice.**

**Have fun building!** 🚀
