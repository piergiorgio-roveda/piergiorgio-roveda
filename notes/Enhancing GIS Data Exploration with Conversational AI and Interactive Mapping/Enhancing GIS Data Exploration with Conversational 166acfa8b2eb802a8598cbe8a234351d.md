# Enhancing GIS Data Exploration with Conversational AI and Interactive Mapping

## Overview

GIS data analysts can be support with ChatGPT's capabilities by creating a conversational interface integrated with a map for database exploration. The concept involves building a workflow where users can interact with geospatial databases through natural language queries while viewing results in an interactive map interface.

The workflow provides:

1. **Location-Based Queries**: Users can ask location-specific questions like "What are the most walkable streets around me?" and receive dynamic responses based on database indices such as walkability, traffic, pollution, and green space.
2. **Dynamic Descriptions**: ChatGPT generates adaptive narratives based on GIS data, aggregating multiple indices to provide insights that are specific to the user's query.
3. **Enhanced Data Access**: The chat integrates fuzzy matching to handle approximate queries (e.g., misspelled street names) and uses descriptive fields to suggest relevant features even if direct matches are not found.
4. **Personalized Insights**: Users can set preferences (e.g., prioritize green spaces or minimize traffic) to tailor responses to their specific needs, making the exploration process more user-centric.
5. **Interactivity**: The workflow seamlessly integrates the chatbox with a map, allowing users to explore data visually and contextually in a GIS-friendly format.

## Challenges and Benefits

- Reduces the barrier for non-technical users to query complex geospatial data.
- Speeds up exploration and decision-making by providing immediate, conversational responses.
- Enhances teamwork by offering a unified interface that combines text-based queries with spatial visualization.

This approach modernizes traditional GIS workflows, emphasizing accessibility, user customization, and data-driven storytelling for more engaging and actionable geospatial analysis.

GIS team leads can use this framework to improve cross-department collaboration by enabling decision-makers without GIS expertise to interact with spatial data meaningfully. GIS analysts can focus on refining data quality and analysis while empowering end-users with self-service exploration tools.

## Implementation

A client ask me how can summarize informations from database and this job give me the opportunity to explore how ChatGPT can support this workflow. So I started to create some Python script to analyze categories end statistic from indexes in table with manual extraction from Postgres database. Than this script grow and I automate the extraction from database and the prompting became dynamic. So based on on the query tags and input location, the prompt can be changed with different results.

To implement this idea I used some Virtual server on Digital Ocean, in particular one with a Postgres/PostGIS database and various other to split the heavy jobs. I’m also use Google Colab, to “design” the script before run these in a dedicated environment. On my PC the software QGIS that I love is always open to inspect results on maps.

### Simply query with fallback

```python
# Function to query the database
def query_street_data(street_name):
    cursor.execute("SELECT walkability_index FROM streets_milano WHERE street_name = ?", (street_name,))
    result = cursor.fetchone()
    return result[0] if result else None

# Function to handle chat completion with the database
def get_chat_response(user_input):
    # Check if the input matches a street query pattern
    street_query = None
    if "walkability" in user_input.lower():
        words = user_input.split()
        for word in words:
            walkability_index = query_street_data(word)
            if walkability_index is not None:
                street_query = word
                break
    
    if street_query:
        # Create a custom response based on the database
        response = f"The walkability index for {street_query} is {walkability_index:.2f}."
    else:
        # Default fallback response using OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an assistant knowledgeable about Milan's streets and urban walkability."},
                {"role": "user", "content": user_input}
            ]
        )['choices'][0]['message']['content']
    
    return response
```

### Recognize and process location-based queries

```python
def get_chat_response(user_input):
    if "walkable streets around me" in user_input.lower():
        # Example user location (replace with dynamic input if available)
        user_lat, user_lon = 45.4642, 9.1900  # Milan center (Duomo di Milano)
        
        top_streets = get_top_walkable_streets(user_lat, user_lon)
        if top_streets:
            response = "Here are the top 3 walkable streets near you:\n"
            for i, (street, walkability, distance) in enumerate(top_streets, 1):
                response += f"{i}. {street} - Walkability Index: {walkability:.2f}, Distance: {distance:.2f} km\n"
        else:
            response = "Sorry, I couldn't find any streets near your location."
    else:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an assistant knowledgeable about Milan's streets and urban walkability."},
                {"role": "user", "content": user_input}
            ]
        )['choices'][0]['message']['content']
    
    return response
```

```
Here are the top 3 walkable streets near you:
1. Via Torino - Walkability Index: 85.5, Distance: 0.75 km
2. Corso Buenos Aires - Walkability Index: 78.3, Distance: 1.2 km
3. Viale Monza - Walkability Index: 72.1, Distance: 2.3 km
```

### Integrate Fuzzy Matching

```python
def get_chat_response(user_input):
    # Attempt to find a matching street or similar
    if "walkability" in user_input.lower():
        words = user_input.split()
        for word in words:
            # Direct query first
            walkability_index = query_street_data(word)
            if walkability_index is not None:
                return f"The walkability index for {word} is {walkability_index:.2f}."
            
            # Fuzzy matching for similar streets
            closest_street = find_closest_street(word)
            if closest_street:
                walkability_index = query_street_data(closest_street)
                if walkability_index is not None:
                    return (f"I couldn't find '{word}' in the database. Did you mean '{closest_street}'? "
                            f"The walkability index for {closest_street} is {walkability_index:.2f}.")
    
    # Fallback to OpenAI for broader or unclear queries
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an assistant knowledgeable about Milan's streets and urban walkability."},
            {"role": "user", "content": user_input}
        ]
    )['choices'][0]['message']['content']
    
    return response
```

### Update get_chat_response to utilize the description fallback

```python
def get_chat_response(user_input):
    # Attempt to find a matching street or similar using both name and description
    if "walkability" in user_input.lower():
        words = user_input.split()
        for word in words:
            # Direct query by street name
            walkability_index = query_street_data(word)
            if walkability_index is not None:
                return f"The walkability index for {word} is {walkability_index:.2f}."
            
            # Fuzzy matching using street names or descriptions
            closest_street, match_type = find_closest_street_or_description(word)
            if closest_street:
                walkability_index = query_street_data(closest_street)
                if walkability_index is not None:
                    if match_type == "name":
                        return (f"I couldn't find '{word}' in the database. Did you mean '{closest_street}'? "
                                f"The walkability index for {closest_street} is {walkability_index:.2f}.")
                    elif match_type == "description":
                        return (f"I couldn't find '{word}' directly, but based on the description, "
                                f"'{closest_street}' might be relevant. The walkability index for {closest_street} is {walkability_index:.2f}.")
    
    # Fallback to OpenAI for broader or unclear queries
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an assistant knowledgeable about Milan's streets and urban walkability. If the user provides unclear or approximate input, try to guess the intended street name or location using the description column."},
            {"role": "user", "content": user_input}
        ]
    )['choices'][0]['message']['content']
    
    return response
```

### Dynamic Description Based on Index Values

```python
def generate_description(streets):
    # Aggregate values from indices
    walkability_avg = sum([street[3][0] for street in streets]) / len(streets)
    traffic_avg = sum([street[3][1] for street in streets]) / len(streets)
    pollution_avg = sum([street[3][2] for street in streets]) / len(streets)
    green_space_avg = sum([street[3][3] for street in streets]) / len(streets)

    # Dynamically generate the description based on index thresholds
    description = f"The area around this location has an average walkability index of {walkability_avg:.2f}. "

    # Adjust the narrative for traffic
    if traffic_avg < 50:
        description += "Traffic levels are low, making it a pleasant area for walking. "
    elif 50 <= traffic_avg < 70:
        description += "Traffic levels are moderate, so walking is still manageable, but it may vary during peak hours. "
    else:
        description += "Traffic levels are high, which could make walking less enjoyable at certain times. "

    # Adjust the narrative for pollution
    if pollution_avg < 40:
        description += "Pollution levels are low, indicating excellent air quality in this area. "
    elif 40 <= pollution_avg < 70:
        description += "Pollution levels are moderate, so air quality is generally acceptable but could vary. "
    else:
        description += "Pollution levels are high, which might impact air quality and outdoor activities. "

    # Adjust the narrative for green space
    if green_space_avg > 70:
        description += "Green spaces are abundant, providing a refreshing and natural environment. "
    elif 40 <= green_space_avg <= 70:
        description += "Green spaces are present but could be more prominent in the area. "
    else:
        description += "Green spaces are limited, which might make the area feel more urbanized. "

    return description
    
# Adjusted thresholds for a more sensitive categorization
if traffic_avg < 40:  # Lower threshold for "low"
    description += "Traffic levels are very low, ensuring a peaceful walking environment. "
elif 40 <= traffic_avg < 60:  # Narrower range for "moderate"
    description += "Traffic levels are moderate, making the area generally walkable. "
else:  # Higher sensitivity for "high"
    description += "Traffic levels are high, and caution may be needed when walking during peak hours. "
```

### Incorporating User Preferences

```python
user_preferences = {
    "prioritize": "green_space",  # Options: walkability, traffic, pollution, green_space
}
def generate_description(streets, preferences):
    walkability_avg = sum([street[3][0] for street in streets]) / len(streets)
    traffic_avg = sum([street[3][1] for street in streets]) / len(streets)
    pollution_avg = sum([street[3][2] for street in streets]) / len(streets)
    green_space_avg = sum([street[3][3] for street in streets]) / len(streets)

    description = ""

    if preferences["prioritize"] == "walkability":
        description += f"The walkability index in this area is outstanding at {walkability_avg:.2f}. "
    elif preferences["prioritize"] == "green_space":
        if green_space_avg > 70:
            description += "Green spaces are abundant, creating a refreshing environment. "
        else:
            description += "Green spaces are limited, but the area offers other attractions. "
    elif preferences["prioritize"] == "pollution":
        if pollution_avg < 40:
            description += "The area boasts excellent air quality. "
        else:
            description += "Air quality might be a concern due to higher pollution levels. "
    elif preferences["prioritize"] == "traffic":
        if traffic_avg < 50:
            description += "The streets are calm with minimal traffic. "
        else:
            description += "Traffic can be moderate to high during certain hours. "

    # Add a general summary
    description += f"Overall, the walkability index is {walkability_avg:.2f}, traffic index is {traffic_avg:.2f}, and green space index is {green_space_avg:.2f}."
    return description
```