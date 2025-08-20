# Proximity with Python in QGIS

Link resource: [geodashboard-tips-and-tricks > qgis-python-proximity-250129](https://github.com/piergiorgio-roveda/geodashboard-tips-and-tricks/blob/main/qgis-python-proximity-250129.md) *(https://github.com/piergiorgio-roveda/geodashboard-tips-and-tricks/blob/main/qgis-python-proximity-250129.md)*

**Tags:**

> #GIS #Geospatial #SpatialAnalysis #DataVisualization #QGIS #GIScience #UrbanPlanning #LandUse #EnvironmentalAnalysis #SpatialPlanning #DataScience #DataAnalytics #DataViz #Python

## Question

> I am trying to produce a map to show the proximity of administrative areas to parks. I'd like to show this in terms of how many other administrative areas are between a given area and the nearest park (i.e., 1, 2, 3, 4... areas) and show this in a colour scale, similar to the example image shown below (this shows these parks overlain on a colour map of a different metric). I have a shapefile of these administrative areas and parks. **Do you have any ideas of how this could be done?**

## Answer

To achieve this analysis in QGIS using Python, you need to determine the number of administrative areas between each given area and the nearest park. The process involves:

- Loading administrative areas and parks shapefiles.
- Computing nearest distances from each administrative area to a park.
- Counting the number of administrative areas intersected along the shortest path.
- Classifying and visualizing the results with a color gradient.

### Here's how you can do it using Python in the QGIS Python Console

```python
import processing
from qgis.core import (
    QgsVectorLayer,
    QgsFeature,
    QgsGeometry,
    QgsField,
    QgsProject,
    QgsVectorFileWriter,
    QgsWkbTypes
)
from PyQt5.QtCore import QVariant

# Define file paths
admin_areas_path = "/path/to/admin_areas.shp"
parks_path = "/path/to/parks.shp"
output_path = "/path/to/admin_proximity.shp"

# Load layers
admin_areas = QgsVectorLayer(admin_areas_path, "Administrative Areas", "ogr")
parks = QgsVectorLayer(parks_path, "Parks", "ogr")

if not admin_areas.isValid() or not parks.isValid():
    print("One or both layers failed to load!")
else:
    print("Both layers loaded successfully.")

# Add a new field to store the proximity score (count of areas between admin area and the nearest park)
admin_areas.startEditing()
if "proximity_score" not in [field.name() for field in admin_areas.fields()]:
    admin_areas.dataProvider().addAttributes([QgsField("proximity_score", QVariant.Int)])
admin_areas.updateFields()

# Iterate through administrative areas
for admin_feature in admin_areas.getFeatures():
    admin_geom = admin_feature.geometry()
    
    # Find the nearest park
    min_distance = float("inf")
    nearest_park_geom = None
    for park_feature in parks.getFeatures():
        park_geom = park_feature.geometry()
        distance = admin_geom.distance(park_geom)
        if distance < min_distance:
            min_distance = distance
            nearest_park_geom = park_geom

    # Count the number of administrative areas intersecting the path to the nearest park
    count = 0
    if nearest_park_geom:
        shortest_path_line = admin_geom.shortestLine(nearest_park_geom)
        for other_admin_feature in admin_areas.getFeatures():
            if other_admin_feature.id() != admin_feature.id():  # Exclude itself
                if other_admin_feature.geometry().intersects(shortest_path_line):
                    count += 1

    # Assign the count as the proximity score
    admin_feature["proximity_score"] = count
    admin_areas.updateFeature(admin_feature)

admin_areas.commitChanges()

# Save the updated layer
QgsVectorFileWriter.writeAsVectorFormat(admin_areas, output_path, "utf-8", admin_areas.crs(), "ESRI Shapefile")

# Load the new layer into QGIS
new_layer = QgsVectorLayer(output_path, "Admin Areas Proximity", "ogr")
QgsProject.instance().addMapLayer(new_layer)

print("Proximity analysis completed! The results are stored in the new shapefile and loaded into QGIS.")

# OPTIONAL: Apply graduated color style based on 'proximity_score'
def apply_graduated_style(layer, field_name):
    """Apply a graduated color style based on a numeric field."""
    from qgis.core import QgsGraduatedSymbolRenderer, QgsRendererRange, QgsSymbol
    from PyQt5.QtGui import QColor

    field_idx = layer.fields().lookupField(field_name)
    values = [feature[field_name] for feature in layer.getFeatures()]
    
    if values:
        min_val, max_val = min(values), max(values)
        step = (max_val - min_val) / 5 if max_val > min_val else 1
        ranges = []
        colors = ["#fee0d2", "#fc9272", "#de2d26", "#a50f15", "#67000d"]  # Red gradient scale

        for i in range(5):
            lower = min_val + i * step
            upper = min_val + (i + 1) * step
            symbol = QgsSymbol.defaultSymbol(layer.geometryType())
            symbol.setColor(QColor(colors[i % len(colors)]))
            ranges.append(QgsRendererRange(lower, upper, symbol, f"{lower:.0f} - {upper:.0f}"))

        renderer = QgsGraduatedSymbolRenderer(field_name, ranges)
        renderer.setMode(QgsGraduatedSymbolRenderer.EqualInterval)
        layer.setRenderer(renderer)
        layer.triggerRepaint()

apply_graduated_style(new_layer, "proximity_score")
```

### How It Works

1. Loads the administrative areas and parks layers.
1. Finds the nearest park for each administrative area.
1. Computes the shortest line between the area and its nearest park.
1. Counts how many other administrative areas intersect this shortest path.
1. Assigns the count as a proximity_score to each administrative area.
1. Saves the modified shapefile and loads it into QGIS.
1. Applies a graduated color scale based on proximity scores (optional).

### Expected Outcome

- A new shapefile (admin_proximity.shp) will be created and added to QGIS.
- Each administrative area will have a proximity_score field indicating the number of other areas between it and the nearest park.
- The results will be visualized with a color gradient where areas farther from a park (with more areas between) are shown in darker colors.