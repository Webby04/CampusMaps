# JCU Map Single Page Application (SPA) Proof of Concept (POC)
This map concept will utilise Geojson data to present campus maps in a simple HTML page.

## Helpful Links
- https://jcu.app/map
- https://leafletjs.com/

## Milestones
- #3
- Ability to switch between Cairns and Townsville.
- Expand out the map to include toggles and filters of POIs. Interface Design and UX.
- Add theming (dark/light/auto).
- Add details and information when tapping a building or POI.

## Stretch Goals
- Flutterify/Mobile the maps.
- SPA `manifest.json` setup.
- Deep Linking.

## Data Structure
To get the map png and pbf files you will have to install git-lfs and then run "git lfs pull" in this directory. (the spa-jcu-map-poc folder)

### /mapsdata
The json files in the "mapsdata" directory are Geojson files.
Cairns campus files are prepended with "cns_"
Townsville campus files are prepended with "tsv_"

### /mapstiles
The folder structure is {z}/{x}/{theme}-{y}.png where:
- z is the zoom level, 13 (min) - 20 (max)
- x = x coordinate
- y = y coordinate
- theme = light or dark.

The .png files are called rastor tiles and are generated from the geojson into images.
The .pbf files are called vector tiles and are generated from the geojson into binary files.
The vector tiles don't have a theme in the file name because the theme is applied dynamically using the theme-dark.json and theme-light.json files in the base /mapstiles folder.

You will note that there is no separation between Cairns and Townsville tiles.
Currently, the JCU App pulls all of the tiles in and hard codes the centre of the campus and bounds depending on the selected campus.
This is bad practise and may cause issues setting the camera and bounds in leaflet.
If this does occur you will have to create a workaround or find a way to separate the tiles.

Townsville centre coordinates: 
latitude y: -19.328
longitude x: 146.758
Townsville boundary distance: 3000

Cairns centre coordinates: 
latitude y:  -16.819
longitude x: 145.687
Cairns boundary distance: 2000
