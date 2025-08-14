// Global Natural Phenomena Dashboard JavaScript

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
        
        // Sample data from the provided JSON
        this.sampleData = {
            "earthquakes": [
                {
                    "id": "eq_001",
                    "type": "earthquake",
                    "title": "M 6.1 - Northwestern Turkey",
                    "description": "6.1 magnitude earthquake in Balikesir province",
                    "latitude": 39.8,
                    "longitude": 27.9,
                    "magnitude": 6.1,
                    "depth": 11,
                    "timestamp": "2025-08-10T20:53:00Z",
                    "source": "USGS",
                    "status": "reviewed",
                    "casualties": "1 dead, 29 injured",
                    "damage": "16 buildings collapsed"
                },
                {
                    "id": "eq_002", 
                    "type": "earthquake",
                    "title": "M 4.8 - Southern California",
                    "description": "4.8 magnitude earthquake near Los Angeles",
                    "latitude": 34.0,
                    "longitude": -118.2,
                    "magnitude": 4.8,
                    "depth": 8,
                    "timestamp": "2025-08-14T15:20:00Z",
                    "source": "USGS",
                    "status": "automatic",
                    "casualties": "No casualties reported",
                    "damage": "Minor structural damage"
                },
                {
                    "id": "eq_003",
                    "type": "earthquake", 
                    "title": "M 5.2 - Japan",
                    "description": "5.2 magnitude earthquake off the coast of Honshu",
                    "latitude": 38.5,
                    "longitude": 142.8,
                    "magnitude": 5.2,
                    "depth": 45,
                    "timestamp": "2025-08-14T08:45:00Z",
                    "source": "USGS",
                    "status": "reviewed",
                    "casualties": "No casualties reported",
                    "damage": "No significant damage"
                }
            ],
            "volcanoes": [
                {
                    "id": "vol_001",
                    "type": "volcano",
                    "title": "Great Sitkin Volcano - Alaska",
                    "description": "Continued lava eruption in summit crater",
                    "latitude": 52.076,
                    "longitude": -176.11,
                    "vei": 1,
                    "alert_level": "WATCH",
                    "color_code": "ORANGE",
                    "timestamp": "2025-08-13T19:21:53Z",
                    "source": "USGS-AVO",
                    "status": "ongoing",
                    "activity": "Lava continues to erupt in summit crater"
                },
                {
                    "id": "vol_002",
                    "type": "volcano", 
                    "title": "Mount Spurr - Alaska",
                    "description": "Low-level unrest with elevated seismicity",
                    "latitude": 61.299,
                    "longitude": -152.254,
                    "vei": 0,
                    "alert_level": "ADVISORY", 
                    "color_code": "YELLOW",
                    "timestamp": "2025-08-13T19:21:53Z",
                    "source": "USGS-AVO",
                    "status": "unrest",
                    "activity": "Occasional small earthquakes beneath volcano"
                },
                {
                    "id": "vol_003",
                    "type": "volcano",
                    "title": "Mount Etna - Italy", 
                    "description": "Increased volcanic activity with ash emissions",
                    "latitude": 37.734,
                    "longitude": 15.004,
                    "vei": 2,
                    "alert_level": "WARNING",
                    "color_code": "RED", 
                    "timestamp": "2025-08-14T12:30:00Z",
                    "source": "INGV",
                    "status": "active",
                    "activity": "Ash plumes up to 5000m altitude"
                }
            ],
            "weather": [
                {
                    "id": "wx_001",
                    "type": "heatwave",
                    "title": "Extreme Heat Warning - Southern Europe", 
                    "description": "Dangerous heat conditions with temperatures up to 47°C",
                    "latitude": 41.9,
                    "longitude": 12.5,
                    "intensity": "Extreme",
                    "max_temp": 47,
                    "timestamp": "2025-08-14T06:00:00Z",
                    "source": "ECMWF",
                    "status": "active",
                    "affected_area": "Italy, Greece, Spain"
                },
                {
                    "id": "wx_002", 
                    "type": "cyclone",
                    "title": "Tropical Cyclone forming - Atlantic",
                    "description": "Tropical depression developing into potential hurricane", 
                    "latitude": 15.2,
                    "longitude": -45.8,
                    "intensity": "Moderate",
                    "max_winds": 85,
                    "timestamp": "2025-08-14T18:00:00Z",
                    "source": "NOAA-NHC", 
                    "status": "developing",
                    "forecast": "Expected to reach Category 2 strength"
                },
                {
                    "id": "wx_003",
                    "type": "wildfire",
                    "title": "Large Wildfire Complex - Canada",
                    "description": "Multiple wildfires burning across British Columbia",
                    "latitude": 54.5,
                    "longitude": -125.2, 
                    "intensity": "High",
                    "area_burned": 15000,
                    "timestamp": "2025-08-14T14:00:00Z",
                    "source": "Canadian Forest Service",
                    "status": "active",
                    "containment": "15% contained"
                },
                {
                    "id": "wx_004",
                    "type": "flood", 
                    "title": "Flash Flooding - Nigeria",
                    "description": "Severe flooding affecting multiple states",
                    "latitude": 9.0,
                    "longitude": 7.0,
                    "intensity": "Severe", 
                    "casualties": "151 dead, thousands displaced",
                    "timestamp": "2025-08-13T10:00:00Z",
                    "source": "GDACS",
                    "status": "ongoing",
                    "affected": "Over 200,000 people affected"
                }
            ],
            "news_headlines": [
                {
                    "id": "news_001",
                    "title": "6.1 Magnitude Earthquake Strikes Northwestern Turkey - 1 Dead, 29 Injured",
                    "source": "Reuters",
                    "timestamp": "2025-08-10T21:23:08Z",
                    "category": "earthquake"
                },
                {
                    "id": "news_002", 
                    "title": "Death Toll from Nigeria Flash Floods Rises to 151",
                    "source": "BBC News",
                    "timestamp": "2025-08-13T14:00:00Z",
                    "category": "flood"
                },
                {
                    "id": "news_003",
                    "title": "Western Canada Wildfires Emergency Hits Another Province",
                    "source": "BBC News", 
                    "timestamp": "2025-08-14T09:00:00Z",
                    "category": "wildfire"
                },
                {
                    "id": "news_004",
                    "title": "Fourth Summer Heatwave with 34°C Forecast in UK",
                    "source": "BBC Weather",
                    "timestamp": "2025-08-14T11:48:49Z", 
                    "category": "heatwave"
                },
                {
                    "id": "news_005",
                    "title": "Mount Etna Shows Increased Activity - Aviation Alert Raised",
                    "source": "INGV Italy",
                    "timestamp": "2025-08-14T16:15:00Z",
                    "category": "volcano"
                }
            ],
            "scientific_explanations": {
                "earthquake": {
                    "title": "Understanding Earthquakes",
                    "content": "Earthquakes are caused by the sudden release of energy stored in the Earth's crust. Most earthquakes occur along tectonic plate boundaries where plates interact through collision, separation, or sliding past each other. When stress builds up along fault lines due to plate movement, it eventually exceeds the friction holding the rocks together, causing sudden rupture and energy release in the form of seismic waves."
                },
                "volcano": {
                    "title": "Volcanic Eruptions Explained", 
                    "content": "Volcanic eruptions occur when magma from the Earth's mantle rises to the surface. This happens due to three main factors: buoyancy of the magma, pressure from dissolved gases, and increased pressure on the magma chamber. As magma rises, dissolved gases expand and create bubbles, potentially leading to explosive eruptions depending on the magma's composition and gas content."
                },
                "weather": {
                    "title": "Extreme Weather and Climate Change",
                    "content": "Extreme weather events are becoming more frequent and intense due to climate change. Global warming affects atmospheric and oceanic circulation patterns, leading to more severe heatwaves, stronger storms, prolonged droughts, and heavier precipitation events. The warming atmosphere can hold more moisture, contributing to more intense rainfall and flooding."
                }
            }
        };

        this.init();
    }

    async init() {
        console.log('Initializing Natural Phenomena App...');
        this.setupEventListeners();
        this.initializeMap();
        this.loadData();
        this.setupAutoRefresh();
        
        // Hide loading overlay after everything is ready
        setTimeout(() => {
            this.hideLoadingOverlay();
        }, 2000);
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

        // Add fallback tile layer in case the first one fails
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

        // Set initial map bounds to show most populated areas
        this.map.fitBounds([
            [-60, -180],  // Southwest
            [85, 180]     // Northeast
        ]);

        console.log('Map initialized successfully');
    }

    loadData() {
        console.log('Loading data...');
        
        // Combine all events from different sources
        this.allEvents = [
            ...this.sampleData.earthquakes,
            ...this.sampleData.volcanoes,
            ...this.sampleData.weather
        ];

        console.log('Total events loaded:', this.allEvents.length);

        this.applyFilters();
        this.displayNews();
        this.updateScientificInfo();
        this.updateRecentEvents();
        this.updateStatusBar();
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
        } else {
            console.error('Sidebar toggle elements not found');
        }

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('Filter clicked:', e.target.dataset.type);
                
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
                console.log('Time filter changed:', e.target.value);
                this.currentFilters.timeRange = e.target.value;
                this.applyFilters();
            });
        }

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                console.log('Export button clicked');
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
            return event.magnitude;
        } else if (event.type === 'volcano') {
            return event.vei;
        } else {
            // Weather events - map intensity to numeric value
            const intensityMap = {
                'Low': 1,
                'Moderate': 3,
                'High': 5,
                'Severe': 7,
                'Extreme': 9
            };
            return intensityMap[event.intensity] || 0;
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

        // Create circle marker instead of custom icon for better visibility
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
            this.setStyle({ fillOpacity: 1.0, weight: 3 });
        });
        
        marker.on('mouseout', function() {
            this.setStyle({ fillOpacity: 0.7, weight: 2 });
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

        let specificDetails = '';
        if (event.type === 'earthquake') {
            specificDetails = `
                <div class="popup-detail">
                    <span class="popup-label">Magnitude:</span>
                    <span class="popup-value">${event.magnitude}</span>
                </div>
                <div class="popup-detail">
                    <span class="popup-label">Depth:</span>
                    <span class="popup-value">${event.depth} km</span>
                </div>
                <div class="popup-detail">
                    <span class="popup-label">Casualties:</span>
                    <span class="popup-value">${event.casualties || 'Unknown'}</span>
                </div>
            `;
        } else if (event.type === 'volcano') {
            specificDetails = `
                <div class="popup-detail">
                    <span class="popup-label">Alert Level:</span>
                    <span class="popup-value">${event.alert_level}</span>
                </div>
                <div class="popup-detail">
                    <span class="popup-label">VEI:</span>
                    <span class="popup-value">${event.vei}</span>
                </div>
                <div class="popup-detail">
                    <span class="popup-label">Status:</span>
                    <span class="popup-value">${event.status}</span>
                </div>
            `;
        } else {
            specificDetails = `
                <div class="popup-detail">
                    <span class="popup-label">Intensity:</span>
                    <span class="popup-value">${event.intensity}</span>
                </div>
                <div class="popup-detail">
                    <span class="popup-label">Status:</span>
                    <span class="popup-value">${event.status}</span>
                </div>
            `;
            
            if (event.casualties) {
                specificDetails += `
                    <div class="popup-detail">
                        <span class="popup-label">Casualties:</span>
                        <span class="popup-value">${event.casualties}</span>
                    </div>
                `;
            }
        }

        return `
            <div class="event-popup">
                <div class="popup-header">
                    <span class="popup-icon">${eventIcon}</span>
                    <h4 class="popup-title">${event.title}</h4>
                </div>
                <div class="popup-details">
                    <div class="popup-detail">
                        <span class="popup-label">Time:</span>
                        <span class="popup-value">${formattedTime}</span>
                    </div>
                    ${specificDetails}
                    <div class="popup-detail">
                        <span class="popup-label">Source:</span>
                        <span class="popup-value">${event.source}</span>
                    </div>
                </div>
                <p style="margin-top: 12px; font-size: 13px; color: #b8c5d1; line-height: 1.4;">${event.description}</p>
            </div>
        `;
    }

    getEventIcon(type) {
        const icons = {
            earthquake: '🔴',
            volcano: '🟠',
            heatwave: '🟣',
            cyclone: '🌪️',
            wildfire: '🔥',
            flood: '🔵'
        };
        return icons[type] || '⚠️';
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    displayNews() {
        const newsContainer = document.getElementById('newsContainer');
        if (!newsContainer) return;
        
        const headlines = this.sampleData.news_headlines;

        if (headlines.length === 0) {
            newsContainer.innerHTML = '<div class="loading-spinner">No news available</div>';
            return;
        }

        newsContainer.innerHTML = headlines.map(news => `
            <div class="news-item">
                <h5 class="news-title">${news.title}</h5>
                <div class="news-meta">${news.source} • ${this.formatTimestamp(news.timestamp)}</div>
            </div>
        `).join('');
    }

    updateScientificInfo() {
        const scientificInfo = document.getElementById('scientificInfo');
        if (!scientificInfo) return;
        
        const explanations = this.sampleData.scientific_explanations;

        scientificInfo.innerHTML = `
            <div class="info-tab active" data-type="earthquake">
                <h4>🔴 Earthquakes</h4>
                <p>${explanations.earthquake.content}</p>
            </div>
            <div class="info-tab" data-type="volcano">
                <h4>🟠 Volcanoes</h4>
                <p>${explanations.volcano.content}</p>
            </div>
            <div class="info-tab" data-type="weather">
                <h4>🌦️ Extreme Weather</h4>
                <p>${explanations.weather.content}</p>
            </div>
        `;
    }

    updateRecentEvents() {
        const recentEventsContainer = document.getElementById('recentEvents');
        if (!recentEventsContainer) return;
        
        const recentEvents = this.allEvents
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5);

        if (recentEvents.length === 0) {
            recentEventsContainer.innerHTML = '<div class="loading-spinner">No recent events</div>';
            return;
        }

        recentEventsContainer.innerHTML = recentEvents.map(event => `
            <div class="event-item">
                <div class="event-title">${this.getEventIcon(event.type)} ${event.title}</div>
                <div class="event-time">${this.formatTimestamp(event.timestamp)}</div>
            </div>
        `).join('');
    }

    updateStatusBar() {
        const totalEventsEl = document.getElementById('totalEvents');
        const visibleEventsEl = document.getElementById('visibleEvents');
        const lastUpdatedEl = document.getElementById('lastUpdated');
        
        if (totalEventsEl) totalEventsEl.textContent = this.allEvents.length;
        if (visibleEventsEl) visibleEventsEl.textContent = this.filteredEvents.length;
        if (lastUpdatedEl) {
            lastUpdatedEl.textContent = new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    exportToCSV() {
        if (this.filteredEvents.length === 0) {
            alert('No events to export. Please adjust your filters.');
            return;
        }

        const headers = ['ID', 'Type', 'Title', 'Latitude', 'Longitude', 'Intensity', 'Timestamp', 'Source', 'Status'];
        const csvContent = [
            headers.join(','),
            ...this.filteredEvents.map(event => [
                event.id,
                event.type,
                `"${event.title.replace(/"/g, '""')}"`,
                event.latitude,
                event.longitude,
                this.getEventIntensity(event),
                event.timestamp,
                event.source,
                event.status || 'unknown'
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `natural_phenomena_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        console.log('CSV export completed');
    }

    setupAutoRefresh() {
        // Refresh data every 5 minutes
        setInterval(() => {
            console.log('Auto-refreshing data...');
            this.loadData();
        }, 5 * 60 * 1000);
    }

    hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
            console.log('Loading overlay hidden');
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    
    // Small delay to ensure Leaflet is fully loaded
    setTimeout(() => {
        new NaturalPhenomenaApp();
    }, 100);
});

// Add some utility functions for enhanced interactivity
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}