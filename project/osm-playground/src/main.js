import './style.css'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { createCenterPin } from './centerPin.js'
import * as pmtiles from 'pmtiles'

// github https://github.com/OvertureMaps/explore-site/tree/main/site/src

// Create the map container
document.querySelector('#app').innerHTML = `
  <div id="map"></div>
`

// Register the PMTiles protocol with MapLibre
const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

// Initialize the map
const map = new maplibregl.Map({
  container: 'map',
  style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  center: [9, 45], // Starting position [lng, lat]
  zoom: 18 // Starting zoom
});

// Add navigation controls (zoom in/out, compass)
map.addControl(new maplibregl.NavigationControl(), 'top-right');

// Add scale control
map.addControl(new maplibregl.ScaleControl({
  maxWidth: 100,
  unit: 'metric'
}), 'bottom-left');

// Add fullscreen control
map.addControl(new maplibregl.FullscreenControl());

// Wait for map to load
map.on('load', () => {
  console.log('Map loaded successfully');
  
  // Add PMTiles source
  map.addSource('pmtiles-base', {
    type: 'vector',
    url: 'pmtiles://https://d3c1b7bog2u1nn.cloudfront.net/2025-08-20/base.pmtiles',
    attribution: '© PMTiles Data Contributors'
  });
  
  // Function to discover available source layers in a vector source
  const discoverSourceLayers = async (map, sourceId) => {
    // Wait for the source to be loaded
    await new Promise(resolve => {
      if (map.isSourceLoaded(sourceId)) {
        resolve();
      } else {
        map.once('sourcedata', e => {
          if (e.sourceId === sourceId && map.isSourceLoaded(sourceId)) {
            resolve();
          }
        });
      }
    });
    
    // Try to get the source layer names from the tiles
    try {
      // Query rendered features to discover layers
      const features = map.queryRenderedFeatures(
        [
          [0, 0],
          [map.getCanvas().width, map.getCanvas().height]
        ],
        { source: sourceId }
      );
      
      // Extract unique source-layer names
      const sourceLayers = [...new Set(features.map(f => f.sourceLayer))].filter(Boolean);
      
      console.log(`Discovered source layers for ${sourceId}:`, sourceLayers);
      
      // Create a UI element to display the layers
      const layersElement = document.createElement('div');
      layersElement.className = 'pmtiles-layers-info';
      layersElement.innerHTML = `
        <h3>PMTiles Source Layers</h3>
        <p>Available layers in the PMTiles source:</p>
        <ul>
          ${sourceLayers.length > 0
            ? sourceLayers.map(layer => `<li>${layer}</li>`).join('')
            : '<li>No layers discovered yet. Try zooming or panning the map.</li>'}
        </ul>
        <p><small>Click to close</small></p>
      `;
      
      // Add click handler to close the info panel
      layersElement.addEventListener('click', () => {
        layersElement.style.display = 'none';
      });
      
      document.body.appendChild(layersElement);
      
      return sourceLayers;
    } catch (error) {
      console.error('Error discovering source layers:', error);
      return [];
    }
  };
  
  // Try different approaches for layer ordering and visibility
  
  // First, add the water layer which we know works
  map.addLayer({
    id: 'pmtiles-water',
    type: 'fill',
    source: 'pmtiles-base',
    'source-layer': 'water', // This one is working correctly
    paint: {
      'fill-color': '#a5d1f2',
      'fill-opacity': 0.6
    },
    layout: {
      visibility: 'visible'
    }
  });
  
  // Try alternative source-layer names for buildings
  const buildingLayerNames = ['building', 'buildings', 'osm_buildings', 'base_buildings'];
  let buildingLayerAdded = false;
  
  for (const layerName of buildingLayerNames) {
    try {
      map.addLayer({
        id: `pmtiles-buildings-${layerName}`,
        type: 'fill',
        source: 'pmtiles-base',
        'source-layer': layerName,
        paint: {
          'fill-color': '#d9c9b5',
          'fill-opacity': 0.6,
          'fill-outline-color': '#b3a99a'
        },
        layout: {
          visibility: 'visible'
        }
      });
      console.log(`Successfully added building layer with source-layer: ${layerName}`);
      buildingLayerAdded = true;
    } catch (e) {
      console.log(`Failed to add building layer with source-layer: ${layerName}`, e.message);
    }
  }
  
  // Try alternative source-layer names for transportation
  const transportationLayerNames = ['transportation', 'roads', 'osm_roads', 'base_roads'];
  let transportationLayerAdded = false;
  
  for (const layerName of transportationLayerNames) {
    try {
      map.addLayer({
        id: `pmtiles-roads-${layerName}`,
        type: 'line',
        source: 'pmtiles-base',
        'source-layer': layerName,
        paint: {
          'line-color': '#ffffff',
          'line-width': [
            'interpolate', ['linear'], ['zoom'],
            14, 1,
            18, 4
          ]
        },
        layout: {
          visibility: 'visible'
        }
      });
      console.log(`Successfully added transportation layer with source-layer: ${layerName}`);
      transportationLayerAdded = true;
    } catch (e) {
      console.log(`Failed to add transportation layer with source-layer: ${layerName}`, e.message);
    }
  }
  
  // Try alternative source-layer names for landcover
  const landcoverLayerNames = ['landcover', 'land_cover', 'osm_landcover', 'base_landcover'];
  let landcoverLayerAdded = false;
  
  for (const layerName of landcoverLayerNames) {
    try {
      map.addLayer({
        id: `pmtiles-landcover-${layerName}`,
        type: 'fill',
        source: 'pmtiles-base',
        'source-layer': layerName,
        paint: {
          'fill-color': [
            'match',
            ['get', 'class'],
            'grass', '#c6e2b4',
            'wood', '#aad27c',
            'forest', '#8cb95c',
            'park', '#b5e1a8',
            'water', '#a5d1f2',
            '#d8e8c8' // default color
          ],
          'fill-opacity': 0.5
        },
        layout: {
          visibility: 'visible'
        }
      });
      console.log(`Successfully added landcover layer with source-layer: ${layerName}`);
      landcoverLayerAdded = true;
    } catch (e) {
      console.log(`Failed to add landcover layer with source-layer: ${layerName}`, e.message);
    }
  }
  
  // Try alternative source-layer names for landuse
  const landuseLayerNames = ['landuse', 'land_use', 'osm_landuse', 'base_landuse'];
  let landuseLayerAdded = false;
  
  for (const layerName of landuseLayerNames) {
    try {
      map.addLayer({
        id: `pmtiles-landuse-${layerName}`,
        type: 'fill',
        source: 'pmtiles-base',
        'source-layer': layerName,
        paint: {
          'fill-color': [
            'match',
            ['get', 'class'],
            'residential', '#e0dfdf',
            'industrial', '#d1c0b2',
            'commercial', '#d8c8c0',
            'park', '#c8e6c8',
            'cemetery', '#c4d4bc',
            'hospital', '#e6c0c0',
            'school', '#e6e0c0',
            '#e4e0e0' // default color
          ],
          'fill-opacity': 0.4
        },
        layout: {
          visibility: 'visible'
        }
      });
      console.log(`Successfully added landuse layer with source-layer: ${layerName}`);
      landuseLayerAdded = true;
    } catch (e) {
      console.log(`Failed to add landuse layer with source-layer: ${layerName}`, e.message);
    }
  }
  
  // Create layer controls
  const createLayerControls = () => {
    // Collect all successfully added layer IDs
    const layerIds = [
      { id: 'pmtiles-water', name: 'Water' }
    ];
    
    if (buildingLayerAdded) {
      buildingLayerNames.forEach(name => {
        const id = `pmtiles-buildings-${name}`;
        if (map.getLayer(id)) {
          layerIds.push({ id, name: `Buildings (${name})` });
        }
      });
    }
    
    if (transportationLayerAdded) {
      transportationLayerNames.forEach(name => {
        const id = `pmtiles-roads-${name}`;
        if (map.getLayer(id)) {
          layerIds.push({ id, name: `Roads (${name})` });
        }
      });
    }
    
    if (landcoverLayerAdded) {
      landcoverLayerNames.forEach(name => {
        const id = `pmtiles-landcover-${name}`;
        if (map.getLayer(id)) {
          layerIds.push({ id, name: `Landcover (${name})` });
        }
      });
    }
    
    if (landuseLayerAdded) {
      landuseLayerNames.forEach(name => {
        const id = `pmtiles-landuse-${name}`;
        if (map.getLayer(id)) {
          layerIds.push({ id, name: `Land Use (${name})` });
        }
      });
    }
    
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'layer-controls';
    controlsContainer.innerHTML = `
      <h3>Layer Controls</h3>
      <div class="layer-toggles"></div>
    `;
    
    const togglesContainer = controlsContainer.querySelector('.layer-toggles');
    
    layerIds.forEach(layer => {
      const toggle = document.createElement('div');
      toggle.className = 'layer-toggle';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `toggle-${layer.id}`;
      checkbox.checked = map.getLayoutProperty(layer.id, 'visibility') === 'visible';
      
      checkbox.addEventListener('change', (e) => {
        const visibility = e.target.checked ? 'visible' : 'none';
        map.setLayoutProperty(layer.id, 'visibility', visibility);
      });
      
      const label = document.createElement('label');
      label.htmlFor = `toggle-${layer.id}`;
      label.textContent = layer.name;
      
      toggle.appendChild(checkbox);
      toggle.appendChild(label);
      togglesContainer.appendChild(toggle);
    });
    
    document.body.appendChild(controlsContainer);
  };
  
  // Add a button to discover source layers
  const discoverButton = document.createElement('button');
  discoverButton.className = 'discover-layers-button';
  discoverButton.textContent = 'Discover Source Layers';
  discoverButton.addEventListener('click', () => {
    discoverSourceLayers(map, 'pmtiles-base')
      .then(layers => {
        console.log('Available source layers:', layers);
      });
  });
  document.body.appendChild(discoverButton);
  
  console.log('PMTiles layer added');
  
  // Create the layer controls
  createLayerControls();
  
  // Log the actual source layers to help debug
  setTimeout(() => {
    // Query rendered features to see what's actually available
    const features = map.queryRenderedFeatures();
    const sourceLayers = [...new Set(features
      .filter(f => f.source === 'pmtiles-base')
      .map(f => f.sourceLayer))]
      .filter(Boolean);
    
    console.log('Actually rendered source layers:', sourceLayers);
    
    // Check if any layers are visible
    const layerIds = [
      'pmtiles-landcover',
      'pmtiles-water',
      'pmtiles-buildings',
      'pmtiles-roads',
      'pmtiles-landuse'
    ];
    
    layerIds.forEach(layerId => {
      const visibility = map.getLayoutProperty(layerId, 'visibility');
      const features = map.queryRenderedFeatures({ layers: [layerId] });
      console.log(`Layer ${layerId}: visibility=${visibility}, features=${features.length}`);
    });
  }, 3000);
  
  // Create a pin at the center of the map with keyboard control
  const centerPin = createCenterPin(map, {
    color: "#FF0000",
    draggable: true,
    enableKeyboardControl: true,
    movementStep: 0.0002 // Slightly larger step for easier visibility
  });
  
  // Add instructions to the page
  const instructionsElement = document.createElement('div');
  instructionsElement.className = 'map-instructions';
  instructionsElement.innerHTML = `
    <h3>Pin Control Instructions</h3>
    <p>Move the pin using:</p>
    <ul>
      <li>Arrow keys: ↑ ↓ ← →</li>
      <li>WASD keys: W (up), S (down), A (left), D (right)</li>
      <li>Or drag with mouse</li>
    </ul>
    <p>The location information panel will show details about the area where the pin is located.</p>
    <p>Features like landcover_grass will be highlighted on the map when the pin is over them.</p>
    <p>The map now displays multiple layers from the PMTiles source: landcover, water, buildings, roads, and landuse.</p>
  `;
  document.body.appendChild(instructionsElement);
});
