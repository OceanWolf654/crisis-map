// Global Natural Phenomena Dashboard JavaScript - LIVE DATA VERSION

class NaturalPhenomenaApp {
    constructor() {
        this.map = null;
        this.markers = [];
        this.allEvents = [];
        this.filteredEvents = [];
        this.currentFilters = {
            type: 'all',
            intensity: 0,
            timeRange: '24h'
        };

        // Live API endpoints - UPDATED WITH MORE SOURCES
        this.apiUrls = {
            earthquakes: 'https://earthquake.usgs.gov/fdsnws/event/1/query',
            volcanoes: 'https://volcano.si.edu/news/WeeklyVolcanoRSS.xml',
            gdacs: 'https://www.gdacs.org/xml/rss.xml'
        };

        // Static scientific explanations
        this.scientificExplanations = {
            earthquake: {
                title: "Understanding Earthquakes",
                content: "Earthquakes are caused by the sudden release of energy stored in the Earth's crust. Most earthquakes occur along tectonic plate boundaries where plates interact through collision, separation, or sliding past each other."
            },
            volcano: {
                title: "Volcanic Eruptions Explained",
                content: "Volcanic eruptions occur when magma from the Earth's mantle rises to the surface. This happens due to three main factors: buoyancy of the magma, pressure from dissolved gases, and increased pressure on the magma chamber."
            },
            weather: {
                title: "Extreme Weather and Climate Change",
                content: "Extreme weather events are becoming more frequent and intense due to climate change. Global warming affects atmospheric and oceanic circulation patterns, leading to more severe events."
            }
        };

        // Static news headlines (you can replace with live news API later)
        this.newsHeadlines = [
            {
                id: "news_001",
                title: "6.1 Magnitude Earthquake Strikes Northwestern Turkey - 1 Dead, 29 Injured",
                source: "Reuters",
                timestamp: "2025-08-10T21:23:08Z",
                category: "earthquake"
            },
            {
                id: "news_002",
                title: "Death Toll from Nigeria Flash Floods Rises to 151",
                source: "BBC News",
                timestamp: "2025-08-13T14:00:00Z",
                category: "flood"
            },
            {
                id: "news_003",
                title: "Western Canada Wildfires Emergency Hits Another Province",
                source: "BBC News",
                timestamp: "2025-08-14T09:00:00Z",
                category: "wildfire"
            }
        ];

        this.init();
    }

    async init() {
        console.log('Initializing Natural Phenomena App with live data...');
        this.setupEventListeners();
        this.initializeMap();
        await this.loadLiveData();
        this.setupAutoRefresh();
        
        // Hide loading overlay after everything is ready
        setTimeout(() => {
            this.hideLoadingOverlay();
        }, 1000);
    }

    initializeMap() {
        console.log('Initializing map...');
        
        // Initialize Leaflet map
        this.map = L.map('map', {
            center: [30, 0],
            zoom: 2,
            zoomControl: true,
            attributionControl: true
        });

        // Add dark theme map tiles with fallback
        const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap contributors © CARTO',
            maxZoom: 18,
            subdomains: 'abcd'
        });

        const fallbackTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        });

        darkTiles.addTo(this.map);

        // Handle tile loading errors
        darkTiles.on('tileerror', () => {
            console.log('Dark tiles failed, switching to fallback...');
            this.map.removeLayer(darkTiles);
            fallbackTiles.addTo(this.map);
        });

        // Set initial map bounds
        this.map.fitBounds([
            [-60, -180], // Southwest
            [85, 180]    // Northeast
        ]);

        console.log('Map initialized successfully');
    }

    async loadLiveData() {
        console.log('Loading live data from APIs...');
        
        try {
            // Fetch data from multiple sources in parallel - UPDATED WITH 3 SOURCES
            const [earthquakeData, volcanoData, gdacsData] = await Promise.all([
                this.fetchEarthquakes(),
                this.fetchVolcanoes(),
                this.fetchGdacs()
            ]);

            // Combine all events
            this.allEvents = [
                ...earthquakeData,
                ...volcanoData,
                ...gdacsData
            ];

            console.log('Total live events loaded:', this.allEvents.length);
            
            this.applyFilters();
            this.displayNews();
            this.updateScientificInfo();
            this.updateRecentEvents();
            this.updateStatusBar();
            
        } catch (error) {
            console.error('Error loading live data:', error);
            // Fallback to a few sample events if APIs fail
            this.loadFallbackData();
        }
    }

    async fetchEarthquakes() {
        try {
            const endTime = new Date().toISOString();
            const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // Last 24 hours
            
            const url = `${this.apiUrls.earthquakes}?format=geojson&starttime=${startTime}&endtime=${endTime}&minmagnitude=4.0&orderby=time&limit=100`;
            
            console.log('Fetching earthquakes from:', url);
            
            const response = await fetch(url);
            const data = await response.json();
            
            return data.features.map(feature => ({
                id: feature.id,
                type: 'earthquake',
                title: feature.properties.title || `M ${feature.properties.mag} Earthquake`,
                description: feature.properties.place || 'Unknown location',
                latitude: feature.geometry.coordinates[1],
                longitude: feature.geometry.coordinates[0],
                magnitude: feature.properties.mag,
                depth: feature.geometry.coordinates[2],
                timestamp: new Date(feature.properties.time).toISOString(),
                source: 'USGS',
                status: feature.properties.status || 'automatic'
            }));
        } catch (error) {
            console.error('Error fetching earthquakes:', error);
            return [];
        }
    }

    // NEW - PARSE SMITHSONIAN VOLCANO FEED
    async fetchVolcanoes() {
        try {
            console.log('Fetching volcanoes from:', this.apiUrls.volcanoes);
            
            const response = await fetch(this.apiUrls.volcanoes);
            const xmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(xmlText, 'text/xml');
            const items = [...doc.querySelectorAll('item')];

            return items.map((item, i) => ({
                id: `gvp_${i}`,
                type: 'volcano',
                title: item.querySelector('title')?.textContent || 'Volcano update',
                description: item.querySelector('description')?.textContent || 'Volcanic activity',
                latitude: parseFloat(item.querySelector('geo\\:lat, lat')?.textContent) || 0,
                longitude: parseFloat(item.querySelector('geo\\:long, long')?.textContent) || 0,
                vei: 1,
                alert_level: 'ADVISORY',
                color_code: 'YELLOW',
                timestamp: new Date(item.querySelector('pubDate')?.textContent || Date.now()).toISOString(),
                source: 'Smithsonian GVP',
                status: 'ongoing'
            })).filter(v => v.latitude && v.longitude);
        } catch (error) {
            console.error('Error fetching volcanoes:', error);
            return [];
        }
    }

    // NEW - PARSE GDACS MULTI-HAZARD FEED
    async fetchGdacs() {
        try {
            console.log('Fetching GDACS data from:', this.apiUrls.gdacs);
            
            const response = await fetch(this.apiUrls.gdacs);
            const xmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(xmlText, 'text/xml');
            const items = [...doc.querySelectorAll('item')];

            return items.map((item, i) => {
                const title = item.querySelector('title')?.textContent || '';
                const description = item.querySelector('description')?.textContent || '';
                
                // Determine event type from content
                let eventType = 'wildfire';
                if (/flood/i.test(title + description)) eventType = 'flood';
                else if (/cyclone|hurricane|typhoon|storm/i.test(title + description)) eventType = 'cyclone';
                else if (/fire/i.test(title + description)) eventType = 'wildfire';
                else if (/heat|drought/i.test(title + description)) eventType = 'heatwave';

                return {
                    id: `gdacs_${i}`,
                    type: eventType,
                    title: title,
                    description: description,
                    latitude: parseFloat(item.querySelector('geo\\:lat, lat')?.textContent) || 0,
                    longitude: parseFloat(item.querySelector('geo\\:long, long')?.textContent) || 0,
                    intensity: 'Moderate',
                    timestamp: new Date(item.querySelector('pubDate')?.textContent || Date.now()).toISOString(),
                    source: 'GDACS',
                    status: 'active'
                };
            }).filter(e => e.latitude && e.longitude);
        } catch (error) {
            console.error('Error fetching GDACS data:', error);
            return [];
        }
    }

    loadFallbackData() {
        console.log('Loading fallback sample data...');
        this.allEvents = [
            {
                id: "eq_fallback",
                type: "earthquake",
                title: "M 6.1 - Northwestern Turkey",
                description: "6.1 magnitude earthquake in Balikesir province",
                latitude: 39.8,
                longitude: 27.9,
                magnitude: 6.1,
                depth: 11,
                timestamp: "2025-08-10T20:53:00Z",
                source: "USGS",
                status: "reviewed"
            },
            {
                id: "vol_fallback",
                type: "volcano",
                title: "Mount Etna - Italy",
                description: "Increased volcanic activity",
                latitude: 37.734,
                longitude: 15.004,
                vei: 2,
                alert_level: "WARNING",
                color_code: "RED",
                timestamp: "2025-08-14T12:30:00Z",
                source: "INGV",
                status: "active"
            },
            {
                id: "flood_fallback",
                type: "flood",
                title: "Flash Flooding - Nigeria",
                description: "Severe flooding affecting multiple states",
                latitude: 9.0,
                longitude: 7.0,
                intensity: "Severe",
                timestamp: "2025-08-13T10:00:00Z",
                source: "GDACS",
                status: "ongoing"
            },
            {
                id: "fire_fallback",
                type: "wildfire",
                title: "Large Wildfire Complex - Canada",
                description: "Multiple wildfires burning across British Columbia",
                latitude: 54.5,
                longitude: -125.2,
                intensity: "High",
                timestamp: "2025-08-14T14:00:00Z",
                source: "Canadian Forest Service",
                status: "active"
            }
        ];
        
        this.applyFilters();
        this.displayNews();
        this.updateScientificInfo();
        this.updateRecentEvents();
        this.updateStatusBar();
    }

    setupAutoRefresh() {
        // Refresh data every 5 minutes
        setInterval(() => {
            console.log('Auto-refreshing data...');
            this.loadLiveData();
        }, 5 * 60 * 1000);
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                console.log('Toggling sidebar...');
                sidebar.classList.toggle('collapsed');
            });
        }

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                // Update filter
                this.currentFilters.type = e.target.dataset.type;
                this.applyFilters();
            });
        });

        // Intensity slider
        const intensitySlider = document.getElementById('intensitySlider');
        const intensityValue = document.getElementById('intensityValue');
        
        if (intensitySlider && intensityValue) {
            intensitySlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                intensityValue.textContent = value.toFixed(1);
                this.currentFilters.intensity = value;
                this.applyFilters();
            });
        }

        // Time filter
        const timeFilter = document.getElementById('timeFilter');
        if (timeFilter) {
            timeFilter.addEventListener('change', (e) => {
                this.currentFilters.timeRange = e.target.value;
                this.applyFilters();
            });
        }

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportToCSV();
            });
        }
    }

    applyFilters() {
        console.log('Applying filters:', this.currentFilters);
        
        this.filteredEvents = this.allEvents.filter(event => {
            // Type filter
            if (this.currentFilters.type !== 'all' && event.type !== this.currentFilters.type) {
                return false;
            }

            // Intensity filter
            const intensity = this.getEventIntensity(event);
            if (intensity < this.currentFilters.intensity) {
                return false;
            }

            // Time filter
            if (!this.isWithinTimeRange(event.timestamp, this.currentFilters.timeRange)) {
                return false;
            }

            return true;
        });

        console.log('Filtered events:', this.filteredEvents.length);
        this.updateMarkers();
        this.updateStatusBar();
    }

    getEventIntensity(event) {
        if (event.type === 'earthquake') {
            return event.magnitude || 0;
        } else if (event.type === 'volcano') {
            return event.vei || 0;
        } else {
            // Weather events - map intensity to numeric value
            const intensityMap = {
                'Low': 1,
                'Moderate': 3,
                'High': 5,
                'Severe': 7,
                'Extreme': 9
            };
            return intensityMap[event.intensity] || 5; // Default for weather events
        }
    }

    isWithinTimeRange(timestamp, range) {
        const now = new Date();
        const eventTime = new Date(timestamp);
        const diffHours = (now - eventTime) / (1000 * 60 * 60);

        switch (range) {
            case '1h': return diffHours <= 1;
            case '24h': return diffHours <= 24;
            case '7d': return diffHours <= 168;
            case '30d': return diffHours <= 720;
            case 'all': return true;
            default: return true;
        }
    }

    updateMarkers() {
        if (!this.map) {
            console.error('Map not initialized');
            return;
        }

        console.log('Updating markers...');

        // Clear existing markers
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers = [];

        // Add markers for filtered events
        this.filteredEvents.forEach(event => {
            try {
                const marker = this.createMarker(event);
                if (marker) {
                    marker.addTo(this.map);
                    this.markers.push(marker);
                }
            } catch (error) {
                console.error('Error creating marker for event:', event.id, error);
            }
        });

        console.log('Markers updated. Total visible markers:', this.markers.length);
    }

    createMarker(event) {
        if (!event.latitude || !event.longitude) {
            console.warn('Invalid coordinates for event:', event.id);
            return null;
        }

        // Create circle marker
        const markerOptions = {
            radius: this.getMarkerRadius(event),
            fillColor: this.getMarkerColor(event.type),
            color: '#ffffff',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.7
        };

        const marker = L.circleMarker([event.latitude, event.longitude], markerOptions);

        // Create popup content
        const popupContent = this.createPopupContent(event);
        marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-popup'
        });

        // Add hover effects
        marker.on('mouseover', function() {
            this.setStyle({
                fillOpacity: 1.0,
                weight: 3
            });
        });

        marker.on('mouseout', function() {
            this.setStyle({
                fillOpacity: 0.7,
                weight: 2
            });
        });

        return marker;
    }

    getMarkerRadius(event) {
        const intensity = this.getEventIntensity(event);
        return Math.max(6, Math.min(20, intensity * 2));
    }

    getMarkerColor(eventType) {
        const colors = {
            earthquake: '#ff4757',
            volcano: '#ff7675',
            heatwave: '#a55eea',
            cyclone: '#26de81',
            wildfire: '#ffa502',
            flood: '#2ed573'
        };
        return colors[eventType] || '#74b9ff';
    }

    createPopupContent(event) {
        const eventIcon = this.getEventIcon(event.type);
        const intensity = this.getEventIntensity(event);
        const formattedTime = this.formatTimestamp(event.timestamp);

        return `
            <div class="event-popup">
                <div class="popup-header">
                    <span class="popup-icon">${eventIcon}</span>
                    <h3 class="popup-title">${event.title}</h3>
                </div>
                <div class="popup-details">
                    <div class="popup-detail">
                        <span class="popup-label">Location:</span>
                        <span class="popup-value">${event.description}</span>
                    </div>
                    <div class="popup-detail">
                        <span class="popup-label">Intensity:</span>
                        <span class="popup-value">${intensity}</span>
                    </div>
                    <div class="popup-detail">
                        <span class="popup-label">Time:</span>
                        <span class="popup-value">${formattedTime}</span>
                    </div>
                    <div class="popup-detail">
                        <span class="popup-label">Source:</span>
                        <span class="popup-value">${event.source}</span>
                    </div>
                </div>
            </div>
        `;
    }

    getEventIcon(eventType) {
        const icons = {
            earthquake: '🌋',
            volcano: '🌋',
            heatwave: '🌡️',
            cyclone: '🌀',
            wildfire: '🔥',
            flood: '🌊'
        };
        return icons[eventType] || '⚠️';
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    displayNews() {
        const newsContainer = document.querySelector('.news-container');
        if (!newsContainer) return;

        newsContainer.innerHTML = '';
        
        this.newsHeadlines.forEach(headline => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            newsItem.innerHTML = `
                <div class="news-title">${headline.title}</div>
                <div class="news-meta">${headline.source} • ${this.formatTimestamp(headline.timestamp)}</div>
            `;
            newsContainer.appendChild(newsItem);
        });
    }

    updateScientificInfo() {
        // Update scientific explanations tabs
        Object.keys(this.scientificExplanations).forEach(type => {
            const tab = document.getElementById(`info-${type}`);
            if (tab) {
                const explanation = this.scientificExplanations[type];
                tab.innerHTML = `
                    <h4>${explanation.title}</h4>
                    <p>${explanation.content}</p>
                `;
            }
        });

        // Show earthquake tab by default
        document.querySelectorAll('.info-tab').forEach(tab => tab.classList.remove('active'));
        const earthquakeTab = document.getElementById('info-earthquake');
        if (earthquakeTab) {
            earthquakeTab.classList.add('active');
        }
    }

    updateRecentEvents() {
        const recentContainer = document.querySelector('.recent-events');
        if (!recentContainer) return;

        recentContainer.innerHTML = '';
        
        // Show most recent events (limit to 5)
        const recentEvents = this.allEvents
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5);

        recentEvents.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            eventItem.innerHTML = `
                <div class="event-title">${event.title}</div>
                <div class="event-time">${this.formatTimestamp(event.timestamp)}</div>
            `;
            recentContainer.appendChild(eventItem);
        });
    }

    updateStatusBar() {
        // Update event counts in status bar
        const totalEvents = document.querySelector('#totalEvents');
        const earthquakeCount = document.querySelector('#earthquakeCount');
        const volcanoCount = document.querySelector('#volcanoCount');

        if (totalEvents) totalEvents.textContent = this.filteredEvents.length;
        if (earthquakeCount) {
            earthquakeCount.textContent = this.filteredEvents.filter(e => e.type === 'earthquake').length;
        }
        if (volcanoCount) {
            volcanoCount.textContent = this.filteredEvents.filter(e => e.type === 'volcano').length;
        }
    }

    exportToCSV() {
        console.log('Exporting to CSV...');
        
        if (this.filteredEvents.length === 0) {
            alert('No events to export');
            return;
        }

        // Create CSV content
        const headers = ['ID', 'Type', 'Title', 'Description', 'Latitude', 'Longitude', 'Intensity', 'Timestamp', 'Source'];
        const csvContent = [
            headers.join(','),
            ...this.filteredEvents.map(event => [
                event.id,
                event.type,
                `"${event.title}"`,
                `"${event.description}"`,
                event.latitude,
                event.longitude,
                this.getEventIntensity(event),
                event.timestamp,
                event.source
            ].join(','))
        ].join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `natural-phenomena-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    hideLoadingOverlay() {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    window.app = new NaturalPhenomenaApp();
});