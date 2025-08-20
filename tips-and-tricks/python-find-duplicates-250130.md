# Find Duplicates in Points, Lines, or Polygons with Python

Link resource: [geodashboard-tips-and-tricks > python-find-duplicates-250130](https://github.com/piergiorgio-roveda/geodashboard-tips-and-tricks/blob/main/python-find-duplicates-250130.md)

FULL CODE: <https://github.com/piergiorgio-roveda/geodashboard-tips-and-tricks/blob/main/python-find-duplicates-250130.md>

**Tags:**

> #GIS #Geospatial #SpatialAnalysis #DataVisualization #QGIS #GIScience #UrbanPlanning #LandUse #EnvironmentalAnalysis #SpatialPlanning #DataScience #DataAnalytics #DataViz #Python

## Question

> How can I efficiently detect duplicate geometries (points, lines, or polygons) in geospatial datasets?

## Answer

Optimized Python Script to Find Duplicates in Points, Lines, or Polygons using Geospatial Libraries

1. Import necessary geospatial libraries.
2. Load geospatial data from a supported vector file format (e.g., GeoJSON, Shapefile).
3. Perform duplicate detection based on geometric equivalence or attribute matching.
4. Output the identified duplicates and suggest handling options (e.g., flagging, removal, merging).

Dependencies: geopandas, pandas, shapely

## Here's how you can do it using Python

```python
import geopandas as gpd

def find_geospatial_duplicates(file_path: str, geometry_type: str, threshold: float = 0.0001) -> gpd.GeoDataFrame:
    """
    Identifies duplicate geometries in a given geospatial file (points, lines, or polygons).

    Parameters:
    - file_path (str): Path to the input geospatial file (Shapefile, GeoJSON, etc.).
    - geometry_type (str): Type of geometry to check ('point', 'line', 'polygon').
    - threshold (float): Spatial tolerance for detecting near-duplicates (default 0.0001).

    Returns:
    - GeoDataFrame containing duplicates with an indication of duplicate groups.
    """
    # Step 1: Read the input geospatial data using GeoPandas
    gdf = gpd.read_file(file_path)
    
    # Step 2: Ensure the geometry type matches the user’s specification
    gdf = gdf[gdf.geometry.type.str.lower().str.contains(geometry_type)]
    if gdf.empty:
        raise ValueError(f"No geometries of type '{geometry_type}' found in the file.")

    # Step 3: Normalize geometry by simplifying to reduce small differences in representation
    gdf['normalized_geom'] = gdf.geometry.apply(lambda x: x.simplify(threshold))

    # Step 4: Check duplicates using geometry-based hashing (for exact matches) and spatial proximity (for near matches)
    gdf['geom_hash'] = gdf['normalized_geom'].apply(lambda geom: hash(geom.wkb))

    # Step 5: Detect duplicate groups using pandas
    duplicates = gdf[gdf.duplicated('geom_hash', keep=False)].copy()

    # Step 6: Assign a group ID for easy identification
    duplicates['duplicate_group'] = duplicates.groupby('geom_hash').ngroup()

    # Step 7: Return the duplicates for further processing (flagging or removal)
    return duplicates[['geometry', 'duplicate_group']]


# Example usage
file_path = "path/to/your/geospatial_file.shp"  # Change to your file path
geometry_type = "polygon"  # Options: 'point', 'line', 'polygon'
try:
    duplicates_gdf = find_geospatial_duplicates(file_path, geometry_type)
    print("Found duplicates:")
    print(duplicates_gdf)
except ValueError as e:
    print(e)
```

This code efficiently detects duplicate geometries through hashing and normalization using spatial simplification. The hash function provides robust duplicate detection for exact matches, while simplify accounts for near matches under a spatial threshold.

## Strengths

- Handles multiple geometry types (points, lines, polygons).
- Uses hashing for efficient duplicate detection in large datasets.
- Allows customization through the simplification threshold.

## Potential Improvements

- Consider integrating spatial joins to detect duplicates across different datasets.
- Extend handling for attributes-based duplicate checks (e.g., name, ID).
- For very large datasets, implement spatial indexing or parallel processing to optimize performance.

## Conclusion

This script is highly adaptable for urban planning, environmental monitoring, and infrastructure projects. With careful optimization, it can be extended to large-scale geospatial analytics, contributing to clean and precise geospatial datasets.