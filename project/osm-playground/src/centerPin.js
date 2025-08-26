/**
 * Center Pin Module
 * Creates a simple pin marker at the center of a MapLibre GL map
 * with keyboard control support (arrow keys and WASD),
 * location information retrieval, and feature highlighting
 */
import maplibregl from 'maplibre-gl'

// Movement step in longitude/latitude degrees
const MOVEMENT_STEP = 0.0001;

// Create an info container element
let infoContainer = null;

// Source ID for highlighted features
const HIGHLIGHT_SOURCE_ID = 'highlighted-feature-source';
// Layer ID for highlighted features
const HIGHLIGHT_LAYER_ID = 'highlighted-feature-layer';

// Currently highlighted feature
let currentHighlightedFeature = null;

/**
 * Creates a marker at the center of the provided map
 * @param {Object} map - The MapLibre GL map instance
 * @param {Object} options - Optional configuration for the marker
 * @returns {Object} The created marker instance with attached keyboard control
 */
export function createCenterPin(map, options = {}) {
  // Default options
  const defaultOptions = {
    color: "#FF0000", // Red color
    draggable: false,
    scale: 1,
    enableKeyboardControl: true, // Enable keyboard control by default
    movementStep: MOVEMENT_STEP, // Default movement step
    showLocationInfo: true, // Show location info by default
    highlightFeatures: true // Highlight features by default
  };
  
  // Merge provided options with defaults
  const markerOptions = { ...defaultOptions, ...options };
  
  // Get the center coordinates of the map
  const center = map.getCenter();
  
  // Create a new marker
  const marker = new maplibregl.Marker(markerOptions)
    .setLngLat(center)
    .addTo(map);
  
  console.log('Pin added at center:', center);
  
  // Create info container if it doesn't exist
  if (markerOptions.showLocationInfo && !infoContainer) {
    createInfoContainer();
  }
  
  // Set up highlighting layer if enabled
  if (markerOptions.highlightFeatures) {
    setupHighlightLayer(map);
  }
  
  // Add keyboard control if enabled
  if (markerOptions.enableKeyboardControl) {
    enableKeyboardControl(marker, map, markerOptions.movementStep);
  }
  
  // Set up event listeners for location info and highlighting
  if (markerOptions.showLocationInfo || markerOptions.highlightFeatures) {
    // Get info when marker is initially placed
    getLocationInfo(marker.getLngLat(), map, markerOptions.highlightFeatures);
    
    // Get info when marker is dragged
    marker.on('dragend', () => {
      getLocationInfo(marker.getLngLat(), map, markerOptions.highlightFeatures);
    });
  }
  
  // Return an enhanced marker object with additional methods
  return {
    ...marker,
    enableKeyboardControl: () => enableKeyboardControl(marker, map, markerOptions.movementStep),
    disableKeyboardControl: () => disableKeyboardControl(),
    getLocationInfo: () => getLocationInfo(marker.getLngLat(), map, markerOptions.highlightFeatures),
    highlightFeature: (feature) => highlightFeature(feature, map),
    clearHighlight: () => clearHighlight(map),
    remove: () => {
      disableKeyboardControl();
      clearHighlight(map);
      marker.remove();
      if (infoContainer) {
        infoContainer.style.display = 'none';
      }
      console.log('Pin removed');
    }
  };
}

// Store the keyboard event handler to be able to remove it later
let keyboardEventHandler = null;

/**
 * Enable keyboard control for a marker
 * @param {Object} marker - The marker to control
 * @param {Object} map - The map instance
 * @param {Number} step - Movement step in degrees
 */
function enableKeyboardControl(marker, map, step = MOVEMENT_STEP) {
  // First disable any existing handler to prevent duplicates
  disableKeyboardControl();
  
  // Create the keyboard event handler
  keyboardEventHandler = (e) => {
    // Current position
    const position = marker.getLngLat();
    let lng = position.lng;
    let lat = position.lat;
    
    // Handle key presses
    switch (e.key) {
      // Arrow keys
      case 'ArrowUp':
      case 'w':
      case 'W':
        lat += step; // Move north
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        lat -= step; // Move south
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        lng -= step; // Move west
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        lng += step; // Move east
        break;
      default:
        return; // Exit if not a movement key
    }
    
    // Update marker position
    marker.setLngLat([lng, lat]);
    console.log('Pin moved to:', [lng, lat]);
    
    // Get location info and highlight feature after movement
    getLocationInfo([lng, lat], map, true);
  };
  
  // Add the event listener
  document.addEventListener('keydown', keyboardEventHandler);
  console.log('Keyboard control enabled for pin');
}

/**
 * Creates the info container element
 */
function createInfoContainer() {
  infoContainer = document.createElement('div');
  infoContainer.className = 'location-info-container';
  infoContainer.innerHTML = `
    <h3>Location Information</h3>
    <div class="location-info-content">
      <p>Move the pin to see information about the location.</p>
    </div>
  `;
  document.body.appendChild(infoContainer);
}

/**
 * Sets up the highlight layer on the map
 * @param {Object} map - The map instance
 */
function setupHighlightLayer(map) {
  // Check if the source already exists
  if (!map.getSource(HIGHLIGHT_SOURCE_ID)) {
    // Add a source for highlighted features
    map.addSource(HIGHLIGHT_SOURCE_ID, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });
  }
  
  // Check if the layer already exists
  if (!map.getLayer(HIGHLIGHT_LAYER_ID)) {
    // Add a layer to render the highlighted feature
    map.addLayer({
      id: HIGHLIGHT_LAYER_ID,
      type: 'fill',
      source: HIGHLIGHT_SOURCE_ID,
      paint: {
        'fill-color': '#FFEB3B', // Yellow highlight
        'fill-opacity': 0.5,
        'fill-outline-color': '#FFC107' // Amber outline
      }
    });
  }
}

/**
 * Highlights a feature on the map
 * @param {Object} feature - The feature to highlight
 * @param {Object} map - The map instance
 */
function highlightFeature(feature, map) {
  // Skip if no feature or no geometry
  if (!feature || !feature.geometry) {
    clearHighlight(map);
    return;
  }
  
  // Store the current highlighted feature
  currentHighlightedFeature = feature;
  
  // Make sure the highlight source exists
  if (!map.getSource(HIGHLIGHT_SOURCE_ID)) {
    setupHighlightLayer(map);
  }
  
  // Update the source data with the feature
  map.getSource(HIGHLIGHT_SOURCE_ID).setData({
    type: 'FeatureCollection',
    features: [feature]
  });
  
  console.log('Feature:', feature || 'unknown layer');
  console.log('Highlighted feature:', feature.layer?.id || 'unknown layer');
}

/**
 * Clears any highlighted feature
 * @param {Object} map - The map instance
 */
function clearHighlight(map) {
  currentHighlightedFeature = null;
  
  // Check if the source exists
  if (map.getSource(HIGHLIGHT_SOURCE_ID)) {
    // Clear the source data
    map.getSource(HIGHLIGHT_SOURCE_ID).setData({
      type: 'FeatureCollection',
      features: []
    });
  }
}

/**
 * Gets information about the location at the given coordinates
 * @param {Array|Object} lngLat - The coordinates [lng, lat] or LngLat object
 * @param {Object} map - The map instance
 * @param {Boolean} highlightFeature - Whether to highlight features
 */
function getLocationInfo(lngLat, map, shouldHighlight = false) {
  // Ensure we have a valid lngLat array
  let coordinates;
  if (Array.isArray(lngLat)) {
    coordinates = lngLat;
  } else if (lngLat && typeof lngLat.lng === 'number' && typeof lngLat.lat === 'number') {
    coordinates = [lngLat.lng, lngLat.lat];
  } else {
    console.error('Invalid coordinates provided to getLocationInfo');
    return;
  }
  
  // Create the info container if it doesn't exist
  if (!infoContainer) {
    createInfoContainer();
  }
  
  // Get the pixel coordinates for the lngLat
  const point = map.project(coordinates);
  
  // Query the map for features at the point
  const features = map.queryRenderedFeatures(point);
  console.log('Features at location:', features);
  // Update the info container with the feature information
  const infoContent = infoContainer.querySelector('.location-info-content');
  
  // Handle feature highlighting if enabled
  if (shouldHighlight && features.length > 0) {
    // Try to find a landcover_grass feature first
    const grassFeature = features.find(f =>
      f.layer.id.includes('landcover') &&
      f.properties &&
      (f.properties.class === 'grass' ||
       f.properties.subclass === 'grass' ||
       f.layer.id.includes('grass'))
    );
    
    // If we found a grass feature, highlight it
    if (grassFeature) {
      highlightFeature(grassFeature, map);
    }
    // Otherwise highlight the first polygon feature we find
    else {
      const polygonFeature = features.find(f =>
        f.geometry && f.geometry.type.includes('Polygon')
      );
      
      if (polygonFeature) {
        highlightFeature(polygonFeature, map);
      } else {
        // If no polygon features, clear any existing highlight
        clearHighlight(map);
      }
    }
  } else if (shouldHighlight) {
    // Clear highlight if no features found
    clearHighlight(map);
  }
  
  if (features.length === 0) {
    infoContent.innerHTML = `
      <p>No features found at this location.</p>
      <p>Coordinates: ${coordinates[0].toFixed(6)}, ${coordinates[1].toFixed(6)}</p>
    `;
  } else {
    // Format the feature information
    let featuresHtml = '<ul>';
    
    // Limit to first 5 features to avoid overwhelming the display
    const displayFeatures = features.slice(0, 5);
    
    displayFeatures.forEach(feature => {
      // Check if this is the highlighted feature
      const isHighlighted = currentHighlightedFeature &&
                           feature.layer.id === currentHighlightedFeature.layer.id;
      
      // Add a highlight indicator if this feature is highlighted
      const highlightIndicator = isHighlighted ?
        ' <span class="highlight-indicator">★</span>' : '';
      
      featuresHtml += `<li><strong>${feature.layer.id || 'Unnamed layer'}${highlightIndicator}</strong>`;
      
      if (feature.properties) {
        // Get the most relevant properties
        const relevantProps = getRelevantProperties(feature.properties);
        
        if (relevantProps.length > 0) {
          featuresHtml += '<ul>';
          relevantProps.forEach(prop => {
            featuresHtml += `<li>${prop.key}: ${prop.value}</li>`;
          });
          featuresHtml += '</ul>';
        }
      }
      
      featuresHtml += '</li>';
    });
    
    featuresHtml += '</ul>';
    
    infoContent.innerHTML = `
      <p>Coordinates: ${coordinates[0].toFixed(6)}, ${coordinates[1].toFixed(6)}</p>
      <p>Features found: ${features.length}</p>
      ${featuresHtml}
    `;
  }
  
  // Make sure the container is visible
  infoContainer.style.display = 'block';
}

/**
 * Gets the most relevant properties from a feature's properties object
 * @param {Object} properties - The feature properties
 * @returns {Array} Array of {key, value} objects
 */
function getRelevantProperties(properties) {
  // List of important OSM property keys to prioritize
  const priorityKeys = [
    'name', 'name:en', 'name:local',
    'highway', 'building', 'amenity',
    'shop', 'leisure', 'landuse',
    'natural', 'waterway', 'place',
    'addr:street', 'addr:housenumber'
  ];
  
  const result = [];
  
  // First add priority keys if they exist
  priorityKeys.forEach(key => {
    if (properties[key]) {
      result.push({
        key: key,
        value: properties[key]
      });
    }
  });
  
  // Then add other keys (up to a reasonable limit)
  const maxProps = 10;
  const keys = Object.keys(properties);
  
  for (let i = 0; i < keys.length && result.length < maxProps; i++) {
    const key = keys[i];
    // Skip keys we've already added
    if (!priorityKeys.includes(key)) {
      result.push({
        key: key,
        value: properties[key]
      });
    }
  }
  
  return result;
}

/**
 * Disable keyboard control
 */
function disableKeyboardControl() {
  if (keyboardEventHandler) {
    document.removeEventListener('keydown', keyboardEventHandler);
    keyboardEventHandler = null;
    console.log('Keyboard control disabled for pin');
  }
}

/**
 * Removes a marker from the map
 * @param {Object} marker - The marker to remove
 */
export function removePin(marker) {
  if (marker) {
    // If it's our enhanced marker with the remove method
    if (typeof marker.remove === 'function') {
      marker.remove();
    }
    // If it's a standard maplibre marker
    else {
      disableKeyboardControl();
      marker.remove();
      console.log('Pin removed');
    }
  }
}