An interactive, real-time visualization platform that displays natural disasters, extreme weather events, and global emergencies on a 3D/2D world map. The project fetches live data from multiple APIs and presents it with intuitive filtering, severity indicators, and timeline playback.

📌 Features

Real-Time Data — Fetches disaster reports as they happen using multiple global APIs (earthquakes, cyclones, floods, wildfires, etc.).

Interactive Map — Zoom, pan, and click on events to view detailed info.

Event Categories — Color-coded icons for different disaster types.

Severity Indicators — Displays magnitude, affected population, and estimated damage.

Timeline Playback — Scroll through historical disaster data.

Custom Filters — Filter events by type, location, and severity.

Responsive UI — Works on desktop, tablet, and mobile.

🚀 Tech Stack

Frontend: HTML5, CSS3, JavaScript, Leaflet.js or Mapbox GL JS, D3.js for data visualization.

Backend: Node.js (Express) for API aggregation & caching.

APIs:

USGS Earthquake Hazards Program

NASA EONET

GDACS

Weather & storm data sources.

📦 Installation
# Clone the repository
git clone https://github.com/<your-username>/<repo-name>.git

# Navigate to the project folder
cd <repo-name>

# Install backend dependencies
npm install

# Start the development server
npm run dev

⚡ Usage

Open http://localhost:3000 in your browser.

Interact with the map using zoom, click, and filter controls.

Toggle the timeline mode to view past events.

📁 Project Structure
/public         # Static assets
/src
   /frontend    # UI components, map rendering
   /backend     # API fetching & caching
   /utils       # Helper functions
README.md
package.json

📜 License

I recommend MIT License — it’s simple, permissive, and allows anyone to use, modify, and distribute your code with attribution.

🤝 Contributing

Contributions are welcome!

Fork the repository.

Create a new branch (feature/my-feature).

Commit changes and push.

Open a Pull Request.

📬 Contact

For questions or suggestions, contact:
Mail: oceanwolf654@gmail.com
