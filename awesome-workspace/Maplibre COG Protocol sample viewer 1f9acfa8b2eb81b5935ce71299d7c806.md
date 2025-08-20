# Maplibre COG Protocol sample viewer

![preview.png](preview.png)

# Same data, three usages

```
maplibregl.addProtocol('cog', cogProtocol);

const sources = {
  'hipsoSource': {
    type: 'raster',
    url: 'cog://https://cdn.geomatico.es/' +
      'pirineo_dem_cog_256.tif' +
      '#color:BrewerBrBG10,1300,2400,c-',
    tileSize: 256
  },
  'hillshadeSource': {
    type: 'raster-dem',
    url: 'cog://https://cdn.geomatico.es/' +
    'pirineo_dem_cog_256.tif#dem',
    tileSize: 256
  },
  'terrainSource': {
    type: 'raster-dem',
    url: 'cog://https://cdn.geomatico.es/' +
    'pirineo_dem_cog_256.tif#dem',
    tileSize: 256
  },
};

const layers = [{
  source: 'hipsoSource',
  id: 'imageLayer',
  type: 'raster'
},{
  source: 'hillshadeSource',
  id: 'hillshadingLayer',
  type: 'hillshade'
}];

const terrain = {
  source: 'terrainSource'
};
```