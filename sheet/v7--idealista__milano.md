# V7 Idealista Milano

## Description

Idealista Milano is a cutting-edge project developed using the new beta version of [GEO]DASHBOARD v7. This initiative was born out of the need to find a good apartment among those available in the city of Milan. The name "Idealista" references the data used to update real estate values, which forms the foundation of this project.

Idealista Milano leverages advanced geospatial technology to provide users with a comprehensive and interactive platform for apartment hunting. The project integrates daily update data on available apartments, including their locations, prices, and relevant amenities. By utilizing the latest features of [GEO]DASHBOARD v7, users can easily filter and visualize apartment listings based on their specific criteria, making the search process more efficient and tailored to their needs.

## Repositories

| Name        | Description | Link       | GitHub|
| ----------- | ----------- | ---------- | ---------- |
|Jupyter Notebook|/|[geodashboard-v7--py__idealista__milano](doc/private-access.md)|[PRIVATE](doc/private-access.md)|
|WebApp|/|[geodashboard-v7--map__idealista__milano](doc/private-access.md)|[PRIVATE](doc/private-access.md)|

## Why Two Repositories?

In the development of our project, we decided to split the codebase into two separate repositories. This decision was driven by the need to optimize the management of different components: a Python script server for data extraction and management, and a server dedicated to map visualization with MapBox and JavaScript functions hosted on an HTTPS Apache server.

While the decision to use two repositories introduces some complexity, the benefits of separation of concerns, specialized environments, scalability, security, and easier maintenance outweigh the downsides. This approach allows us to create a robust and efficient system tailored to the specific needs of data extraction and map visualization, ultimately providing a better experience for our users.

## Features

![Idealista Milano Thumbnail](https://cityplanner.biz/geodashboard-v7/map__idealista__milano/assets/images/thumb.jpg "Idealista Milano")

The Idealista Milano map, as shown in the image, is a comprehensive and interactive visualization of real estate data in Milan. This guide outlines the steps taken to create this detailed and user-friendly map using a combination of PostgreSQL, Python, open data, and web development tools with MapBox.

1. **Preparation of Tables in PostgreSQL**:
   - The first step involves setting up the necessary tables in PostgreSQL to store real estate data. This includes tables for property listings, contextual data such as public transport locations, parks, and other relevant information.

2. **Creation of Python Scripts for Data Extraction**:
   - Python scripts are developed to extract updated property data from various sources. These scripts fetch the latest real estate listings, ensuring the data remains current and accurate.

3. **Data Manipulation, Analysis, and Storage**:
   - Additional Python scripts are used to manipulate, analyze, and store the extracted data in the PostgreSQL database. This includes cleaning the data, performing calculations (e.g., price per square meter), and updating the database with new entries.

4. **Downloading and Manipulating Open Data**:
   - Open data is downloaded and processed to enrich the visualization with contextual information. This includes data on public transportation, parks, and other amenities that influence property values.

5. **Preparation of the Dashboard Web Template**:
   - A web template is prepared for customizing the dashboard. This template serves as the foundation for displaying the map and integrating various interactive elements.

6. **Creation of Symbol Styles**:
   - Custom styles for map symbols are created, considering the two main variables: price and price per square meter. Different colors and icons are used to represent various price ranges and property types.

7. **Development of a Price Filter**:
   - A filter based on price is developed, allowing users to narrow down their search by selecting specific price ranges. This enhances the user experience by making it easier to find properties within their budget.

8. **Integration of Google Street View**:
   - Google Street View is integrated into the map, providing users with a real-world view of the property locations. This feature helps users get a better sense of the neighborhood and surroundings.

9. **Adding Open Data with Buffers**:
   - Open data, such as the locations of metro stations and parks, is added to the map with buffer zones. These buffers highlight areas of interest, such as properties near transport links or green spaces, as well as potential disturbance zones like railway lines.

10. **Adding HERE Traffic Layer**:
    - The HERE traffic layer is added to display real-time traffic conditions. This feature helps users assess the accessibility and convenience of different properties based on current traffic flows.

By following these steps, the Idealista Milano map provides a comprehensive and interactive platform for exploring real estate opportunities in Milan, combining the power of geospatial data with user-friendly visualization tools.