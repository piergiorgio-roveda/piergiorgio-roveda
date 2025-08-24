console.clear();

// OVERENGINEERED UNOPTIMIZED CANVAS BULLSH*T
// BUT IT'S OKAY SINCE IT'S BLADE RUNNER INNIT

// Some stuff left unoptimized / verbose to show the work.

// TODO:
// - optimize render loop, avoid overdraws, etc
// - smoothly fade rows in on the horizon

// Constants.  Change at own risk
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 300;
const FRAME_TIME = 1000 / 16;
const LIGHT_ROWS = 20;
const LIGHT_ROW_DEPTH = 2;
const LIGHT_SPACING = 0.6;
const LIGHT_SIZE = 0.1;
const LIGHT_SCATTER = 0.4;
const BUILDING_ROWS = 38;
const BUILDING_ROW_DEPTH = 1;
const BUILDING_ROW_WIDTH = 60;
const BUILDING_MIN_HEIGHT = 1.5;
const BUILDING_MAX_HEIGHT = 3;
const STACK_HEIGHT = 9;
const STACK_THRESHOLD = 0.87;
const STACK_LIGHT_CHANCE = 0.95;
const STACK_LIGHT_SIZE = 0.13;
const FADE_GRAY_VALUE = 25;
const FADE_OFFSET = 0.35;

// Virtual camera. Used in perspective calculations
const CAMERA = {
  x: 0,
  y: 10,
  z: 0,
  fov: 170,
  dist: 30,
  zSpeed: 0.005 };


// Virtual vanishing point XY. Used in perspective calculations
const VP_OFS = {
  x: 0.5,
  y: 0.27 };


// Global hoisted vars for rendering contexts and timers
let c, ctx, output_c, output_ctx;
let _t, _dt, _ft;

// Seedable random number generator.
// Not particularly well-distributed, but fine for this case.
// Allows us to emit the same set of random numbers on every frame
// so we can consistently re-render the scene.
const RNG = {
  seed: 1,
  random() {
    const x = Math.sin(RNG.seed++) * 10000;
    return x - (x << 0);
  },
  randomInRange(min, max) {
    return (RNG.random() * (max - min + 1) << 0) + min;
  } };


// Module to get a random colour from a predefined list.
// Uses the seedable RNG
const Palette = (() => {
  const PAL = [
  "black",
  "#111",
  "#113",
  "white",
  "sliver",
  "#f88",
  "orange",
  "oldlace",
  "#569"];

  const lastIndex = PAL.length - 1;

  function getRandomFromPalette() {
    return PAL[RNG.randomInRange(0, lastIndex)];
  }

  return {
    getRandom: getRandomFromPalette };

})();

function ceil(n) {
  var f = n << 0,
  f = f == n ? f : f + 1;
  return f;
}

// Update method of main loop
function update() {
  // Update our global timestamp (used in rendering)
  _t = Date.now() * 0.001;
  // Move the camera slowly 'forward'
  CAMERA.z += CAMERA.zSpeed;
}

// Draw a frame of the scene.
// Uses the current timestamp and the seeded RNG to render a
// pseudorandom cityscape with lights and buildings.
// We always generate and draw a set amount of city in front of
// the camera, so it appears to be endless as we 'fly over' it.
//
// 1. Clear the whole scene
// 2. Render random rows of lights
// 3. Render random rows of buildings
// 4. Blit scene to onscreen canvas
let _$ = {
  vPointX: 0,
  vPointY: 0,
  rowScreenX: 0,
  MAX_LIGHTS: 0,
  closestLightRow: 0,
  rowZ: 0,
  rowRelativeZ: 0,
  scalingFactor: 0,
  rowScreenWidth: 0,
  rowScreenHeight: 0,
  rowScreenY: 0,
  rowScreenLightSpacing: 0,
  rowLightCount: 0,
  lightSize: 0,
  lightHalfSize: 0,
  lightScreenX: 0,
  lightScreenY: 0,
  closestBuildingRow: 0,
  rowBuildingCount: 0,
  rowBuildingScreenWidth: 0,
  rowShade: 0,
  rowStyleString: "",
  lightData: [],
  isStack: false,
  buildingHeight: 0,
  buildingScreenHeight: 0,
  buildingScreenX: 0,
  buildingScreenY: 0,
  lightSize: 0,
  lightHalfSize: 0,
  lightColor: 0 };

function render() {
  // Calculate the pixel XY of the vanishing point
  // (could be done on init, but useful if we ever want to
  // dynamically move the camera)
  _$.vPointX = c.width * VP_OFS.x >> 0;
  _$.vPointY = c.height * VP_OFS.y >> 0;

  // If we wanted to, we could give each row an X offset
  // and include it in perspective calculations,
  // but we just use the centre alignment for each one here.
  _$.rowScreenX = CAMERA.x + _$.vPointX;

  // 1. Clear the whole scene...
  // (canvases are transparent so that the CSS 'sky' gradient can be seen)
  ctx.clearRect(0, 0, c.width, c.height);
  output_ctx.clearRect(0, 0, output_c.width, output_c.height);

  // 2. Render random rows of lights...

  // Calculate the closest row to the camera so we
  // can render the required number of rows into the distance
  _$.closestLightRow = Math.floor(CAMERA.z / LIGHT_ROW_DEPTH);

  // Draw each row of lights
  for (let i = 0; i < LIGHT_ROWS; i++) {
    // Calculate this row's base Z position
    // and Z relative to camera
    _$.rowZ = _$.closestLightRow * LIGHT_ROW_DEPTH + LIGHT_ROW_DEPTH * i;
    _$.rowRelativeZ = _$.rowZ - CAMERA.z;

    // Don't draw the row if it's behind the camera,
    // or beyond the camera's draw distance
    if (_$.rowRelativeZ <= 0 || _$.rowRelativeZ > CAMERA.dist) {
      continue;
    }

    // Get the perspective scaling factor and pixel Y position for this row
    _$.scalingFactor = CAMERA.fov / _$.rowRelativeZ;
    _$.rowScreenY = CAMERA.y * _$.scalingFactor + _$.vPointY;

    // Don't draw the row if it's off-canvas
    if (_$.rowScreenY > c.height) {
      continue;
    }

    // Calculate the spacing and number of lights we need to render for this row
    _$.rowScreenLightSpacing = LIGHT_SPACING * _$.scalingFactor;
    _$.rowLightCount = c.width / _$.rowScreenLightSpacing;

    // Seed the RNG in a way that gets us decent distribution
    // for the random lights
    RNG.seed = _$.rowZ * 0.573;

    // Render the random lights for this row
    for (let j = 0; j < _$.rowLightCount; j++) {
      // Randomize light size, with perspective
      _$.lightSize = RNG.random() * (LIGHT_SIZE * _$.scalingFactor);
      _$.lightHalfSize = _$.lightSize * 0.5;

      // Randomly offset the XY of the light, with perspective
      _$.lightScreenX =
      j * _$.rowScreenLightSpacing +
      RNG.random() * LIGHT_SCATTER * _$.scalingFactor -
      _$.lightHalfSize;
      _$.lightScreenY =
      _$.rowScreenY +
      RNG.random() * LIGHT_SCATTER * _$.scalingFactor -
      _$.lightHalfSize;

      // Don't render if the light is offscreen
      if (
      _$.lightScreenX < 0 ||
      _$.lightScreenX > c.width ||
      _$.lightScreenY > c.height)
      {
        // HACK: we still need to call the RNG the same number of times
        // for every row to ensure consistency between frames. If we didn't
        // do this, the lights would jump all over the place near the edges
        // of the screen.
        Palette.getRandom();
        continue;
      }

      // Pick a random colour for this light
      ctx.fillStyle = Palette.getRandom();

      // Render the light twice, mirrored either side of the centre vanishing point.
      // Saves us having to do perspective offset calculation for every light,
      // and won't be noitceable when we overlay the city buildings.
      ctx.fillRect(
      _$.rowScreenX + _$.lightScreenX,
      _$.lightScreenY,
      _$.lightSize,
      _$.lightSize);

      ctx.fillRect(
      _$.rowScreenX - _$.lightScreenX,
      _$.lightScreenY,
      _$.lightSize,
      _$.lightSize);

    }
  }

  // 3. Render random rows of buildings...

  // Calculate the closest row to the camera so we
  // can render the required number of rows into the distance
  _$.closestBuildingRow = Math.floor(CAMERA.z / BUILDING_ROW_DEPTH);

  // Draw each row of buildings
  for (let i = BUILDING_ROWS; i > 0; i--) {
    // Calculate this row's base Z position
    // and Z relative to camera
    _$.rowZ =
    _$.closestBuildingRow * BUILDING_ROW_DEPTH + BUILDING_ROW_DEPTH * i;
    _$.rowRelativeZ = _$.rowZ - CAMERA.z;

    // Don't draw the row if it's behind the camera,
    // or beyond the camera's draw distance
    if (_$.rowRelativeZ <= 0 || _$.rowRelativeZ > CAMERA.dist) {
      continue;
    }

    // Get the perspective scaling factor and pixel Y position for this row
    _$.scalingFactor = CAMERA.fov / _$.rowRelativeZ;

    // Calculate the perspective-scaled position and base size of our row.
    // Offset the XY so that the row's 'origin' is at centre bottom (i.e. ground-up)
    _$.rowScreenWidth = BUILDING_ROW_WIDTH * _$.scalingFactor;
    _$.rowScreenHeight = BUILDING_MAX_HEIGHT * _$.scalingFactor;
    _$.rowScreenX =
    CAMERA.x * _$.scalingFactor + _$.vPointX - _$.rowScreenWidth * 0.5;
    _$.rowScreenY =
    CAMERA.y * _$.scalingFactor + _$.vPointY - _$.rowScreenHeight;

    // Seed the RNG to keep rendering consistent for this row
    RNG.seed = _$.rowZ;

    // Calculate a random number of buildings for this row
    // and get their screen width
    _$.rowBuildingCount = RNG.randomInRange(20, 70);
    _$.rowBuildingScreenWidth = _$.rowScreenWidth / _$.rowBuildingCount;

    // Calculate the shade we want the buildings in this row to be.
    // The tint is darker nearer the camera, giving a sort of crude distance fog
    // near the horizon.
    _$.rowShade = Math.round(
    FADE_GRAY_VALUE * (_$.rowRelativeZ / CAMERA.dist - FADE_OFFSET));

    _$.rowStyleString =
    "rgb(" + _$.rowShade + "," + _$.rowShade + "," + _$.rowShade + ")";

    // Calclate and render each building
    _$.lightData.length = 0;
    ctx.fillStyle = _$.rowStyleString;
    for (let j = 0; j < _$.rowBuildingCount; j++) {
      // Buildings have a certain chance to become a 'stack' i.e. way taller than
      // everything else. We calculate a random ranged height for the building,
      // and if it exceeds a threshold, it gets turned into a stack.
      _$.isStack = false;
      _$.buildingHeight = Math.max(
      BUILDING_MIN_HEIGHT,
      RNG.random() * BUILDING_MAX_HEIGHT);


      if (_$.buildingHeight > BUILDING_MAX_HEIGHT * STACK_THRESHOLD) {
        _$.isStack = true;
        // Stacks have 40% height variance
        _$.buildingHeight = STACK_HEIGHT * 0.6 + RNG.random() * 0.4;
      }

      // Calculate the pixel size and position of this building, adjusted for perspective
      _$.buildingScreenHeight = _$.buildingHeight * _$.scalingFactor;
      _$.buildingScreenX = _$.rowScreenX + j * _$.rowBuildingScreenWidth;
      _$.buildingScreenY =
      _$.rowScreenY + _$.rowScreenHeight - _$.buildingScreenHeight;

      // Draw the building on screen
      ctx.fillRect(
      _$.buildingScreenX,
      _$.buildingScreenY,
      Math.ceil(_$.rowBuildingScreenWidth),
      _$.buildingScreenHeight);


      // Seed the RNG for consistency when calculating stack lights (if needed)
      RNG.seed = _$.buildingHeight + j;

      // Stacks have a chance to get lights on their top corners.
      // Generate and store light data so we can render it on top of the buildings
      if (_$.isStack && RNG.random() < STACK_LIGHT_CHANCE) {
        // Get random light size and color.
        // Slightly higher chance of red vs white lights
        _$.lightSize = RNG.random() * (STACK_LIGHT_SIZE * _$.scalingFactor);
        _$.lightColor = RNG.random() > 0.6 ? "white" : "red";
        // Save light info for rendering after we do all the buildings
        // (helps minimixe changes to ctx.fillStyle)
        _$.lightData.push(_$.buildingScreenX);
        _$.lightData.push(_$.buildingScreenY);
        _$.lightData.push(_$.lightSize);
        _$.lightData.push(_$.lightColor);
      }
    }

    // Draw any lights on stacks that need them in this row
    for (let j = 0; j < _$.lightData.length; j += 4) {
      _$.buildingScreenX = _$.lightData[j];
      _$.buildingScreenY = _$.lightData[j + 1];
      _$.lightSize = _$.lightData[j + 2];
      _$.lightHalfSize = _$.lightSize * 0.5;
      _$.lightColor = _$.lightData[j + 3];

      // Draw lights centred at the top left and right corners of the stack
      ctx.fillStyle = _$.lightColor;
      ctx.fillRect(
      _$.buildingScreenX - _$.lightHalfSize,
      _$.buildingScreenY - _$.lightHalfSize,
      _$.lightSize,
      _$.lightSize);

      ctx.fillRect(
      _$.buildingScreenX + _$.rowBuildingScreenWidth - _$.lightHalfSize,
      _$.buildingScreenY - _$.lightHalfSize,
      _$.lightSize,
      _$.lightSize);

    }
  }

  // 4. Blit scene to onscreen canvas.
  // Now that we've built up the scene in-memory, we just render the image to
  // our canvas in the DOM.
  output_ctx.drawImage(c, 0, 0);
}

// Main loop.
// Maintains a consistent update rate, but draws the screen as often
// as the browser will allow.
function frame() {
  requestAnimationFrame(frame);
  _ft = Date.now();
  update();
  if (_ft - _dt > FRAME_TIME) {
    render();
    _dt = _ft;
  }
}

// Let's go!
function start() {
  // Init frame timers (see frame())
  _dt = _ft = Date.now();

  // Create two canvases - one for in-memory compositing,
  // and another to go in the DOM for our final render.
  // Make them the same size as each other.
  c = document.createElement("canvas");
  ctx = c.getContext("2d");

  output_c = document.createElement("canvas");
  output_ctx = output_c.getContext("2d");

  output_c.width = c.width = CANVAS_WIDTH;
  output_c.height = c.height = CANVAS_HEIGHT;
  document.body.appendChild(output_c);

  // Start the main loop.
  frame();
}

start();