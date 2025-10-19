# Extract and analyze data from street-level photos

## Overview

I explored the potential use of AI tools like ChatGPT and Gemini to **extract and analyze data from street-level photos**, showcasing their utility in GIS (Geographic Information Systems) workflows and data analysis tasks. This idea have a range of real-world applications, including:

- Extracting specific features such as traffic signs, pedestrian crossings, and road markings.
- Classifying infrastructure based on predefined lists or contextual observations.
- Detecting and interpreting text on walls, signs, and other visible elements in photos (e.g., street names, business names, or directional signs).
- Classifying vehicles, identifying building types, and recognizing context-specific objects.

As side functions Highlighting or overlaying extracted features to visualize data directly on the image  (e.g., bounding boxes for vehicles, marked regions for neighborhoods, traffic direction sign) result offer significant value in augmenting manual workflows. When used as a complementary tool rather than a standalone solution, they can improve efficiency, reduce repetitive tasks, and enhance the overall data collection and analysis process.

![https://geo-source.ams3.digitaloceanspaces.com/screenshoots/24-101112/frame03.png](https://geo-source.ams3.digitaloceanspaces.com/screenshoots/24-101112/frame03.png)

## Challenges and Benefits

I started to explore these solutions and I saw a great value, in particular for:

- Automating repetitive tasks that GIS teams often manually handle.
- Supporting GIS data entry teams by automating the identification and classification of objects and features.
- Assisting data analysts in extracting contextually relevant information for urban planning, transportation, or resource allocation.

## Implementation

In the last month I started to create some Python scripts to analyze possibile results like the following. I dont’ create some library or end user tool, but I use scripts and libraries in a defined workflow like an Agent.

To implement this idea I used some Virtual server on Digital Ocean, in particular one with a Postgres/PostGIS database and various other to split the heavy jobs. I’m also use Google Colab, to “design” the script before run these in a dedicated environment. On my PC the software QGIS that I love is always open to inspect results on maps.

With the following Prompts, I test the responses from model gpt-4o, gemini-2.0-flash-exp, claude-3-5-sonnet.

Basically the code is very similar and is possibile to explore all models, but in particular I focus on the prompt

### Example prompts:

```markdown
prompt="Act as data collector, analyze this image for traffic infrastructure visibile within 20 meters of the camera based on perspective or scale. Identify each feature using few word as possibile: road, sidewalk, crosswalk, traffic light, traffic sign, vehicle, pedestrian, bicycle, bus, truck, motorcycle, construction, other. Extract also in a second list the number of lanes, the direction of the traffic, the presence of a bike lane, the presence of a bus lane, the presence of a parking lane, the presence of a sidewalk, the presence of a crosswalk, the presence of a traffic light, the presence of a traffic sign, the presence of a pedestrian, the presence of a bicycle, the presence of a bus, the presence of a truck, the presence of a motorcycle, the presence of a construction site, the presence of a vehicle, the presence of other objects. In a third list extract all infrastructure related to parking. In a forth list extract words and numbers in image. In fifth list analyze all building entrance and catgeorize them. listIn a sixth list extract the position of each object in the image using the format: object: [top, left, bottom, right]. The output will be a json object with all five lists like {\"list1\": [],\"list2\": {\"lanes\": (as number),\"direction\": (as text),\"bike_lane\": true/false,\"bus_lane\": true/false,\"parking_lane\": true/false,\"sidewalk\": true/false,\"crosswalk\": true/false,\"traffic_light\": true/false,\"traffic_sign\": true/false,\"pedestrian\": true/false,\"bicycle\": true/false,\"bus\": true/false,\"truck\": true/false,\"motorcycle\": true/false,\"construction\": true/false,\"vehicle\": true/false,\"other\": true/false},\"list3\": [(list parking infrastructure)],\"list4\": [(list all text and number)],\"list5\": [(list all buiding entrance type)],\"list6\": {(example: \"road\": [300, 0,585,1334 ])}}"
```

This prompt return a well formatted items, follow my instructions, with 6 list in json format:

```markdown
{
    "list1": [
        "road",
        "sidewalk",
        "crosswalk",
        "traffic sign",
        "vehicle",
        "pedestrian",
        "bicycle"
    ],
    "list2": {
        "lanes": 1,
        "direction": "one way",
        "bike_lane": false,
        "bus_lane": false,
        "parking_lane": true,
        "sidewalk": true,
        "crosswalk": true,
        "traffic_light": false,
        "traffic_sign": true,
        "pedestrian": true,
        "bicycle": true,
...
```

Another prompt example is simplest but with a specific request:

```markdown
"Return bounding boxes as a JSON array with labels. Never "
"return masks or code fencing. Limit to 25 objects. "
"If an object is present multiple times, label them "
"with progressive number."
"Highlight the different traffic infrastructure in the image"
```

With this result

```markdown
[
  {"box_2d": [360, 436, 527, 505], "label": "car"},
  {"box_2d": [371, 594, 496, 677], "label": "car"},
  {"box_2d": [360, 368, 480, 450], "label": "car"},
  {"box_2d": [371, 251, 513, 375], "label": "car"},
  {"box_2d": [350, 673, 496, 748], "label": "motorcycle"},
...
```

![https://geo-source.ams3.digitaloceanspaces.com/screenshoots/24-101112/output.png](https://geo-source.ams3.digitaloceanspaces.com/screenshoots/24-101112/output.png)