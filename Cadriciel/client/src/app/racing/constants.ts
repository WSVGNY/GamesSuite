export const STRAIGHT_ANGLE_DEG: number = 180;
export const DEG_TO_RAD: number = Math.PI / STRAIGHT_ANGLE_DEG;
export const MIN_TO_SEC: number = 60;
export const MS_TO_SECONDS: number = 1000;
export const GRAVITY: number = -9.81;
export const RAD_TO_DEG: number = STRAIGHT_ANGLE_DEG / Math.PI;
export const HALF: number = 0.5;
export const PI_OVER_2: number = Math.PI * HALF;
export const PI_OVER_4: number = Math.PI * HALF * HALF;
export const SQUARED: number = 2;

export const TRACK_WIDTH: number = 20;
export const HALF_TRACK_WIDTH: number = TRACK_WIDTH * HALF;
export const WALL_DISTANCE_TO_TRACK: number = 0;
export const WALL_WIDTH: number = 0.5;
export const RPM_FACTOR: number = 1700;
export const VOLUME: number = 0.2;
export const TIRE_ASPHALT_COEFFICIENT: number = 0.72;
export const MINIMUM_CAR_DISTANCE: number = 3;
export const TRACKING_SPHERE_RADIUS: number = 20;
export const NUMBER_OF_LAPS: number = 3;

export const LOWER_GROUND: number = 0.01;
export const SKYBOX_SIZE: number = 700;

export const START_LINE_WEIGHT: number = 20;
export const START_LINE_WIDTH: number = 6;
export const START_LINE_HEIGHT: number = 0.001;
export const START_CAR_DISTANCE: number = 12;

export const WHITE: number = 0xFFFFFF;
export const PINK: number = 0xFF00BF;
export const BLUE: number = 0x0066FF;
export const RED: number = 0xFF0000;
export const GREEN: number = 0x00FF00;
export const ORANGE: number = 0xFF6600;
export const YELLOW: number = 0xFFFF00;
export const AI_CARS_QUANTITY: number = 3;
export const AI_PERSONALITY_QUANTITY: number = 3;

// Texture Paths
const BASE_URL: string = "http://localhost:4200/";
const BASE_ASSETS_PATH: string = BASE_URL + "assets/";
const BASE_TEXTURE_PATH: string = BASE_ASSETS_PATH + "textures/";
const SKYBOX_PATH: string = BASE_ASSETS_PATH + "skyboxes/";
export const CAR_TEXTURE: string = BASE_ASSETS_PATH + "camero/camero-2010-low-poly.json";
export const SUNSET_SKYBOX: string = SKYBOX_PATH + "sunset/";
export const DEFAULT_SKYBOX: string = SKYBOX_PATH + "default/";
export const NIGHT_SKYBOX: string = SKYBOX_PATH + "nightsky/";
export const CLOUD_SKYBOX: string = SKYBOX_PATH + "clouds/";
export const ROME_SKYBOX: string = SKYBOX_PATH + "rome/";
export const SPACE_SKYBOX: string = SKYBOX_PATH + "space/";
export const ATMOSPHERE_SKYBOX: string = SKYBOX_PATH + "atmosphere/";
export const GROUND_SIZE: number = 10000;
export const ASPHALT_TEXTURE_PATH: string = BASE_TEXTURE_PATH + "asphalte.jpg";
export const ASPHALT_TEXTURE_FACTOR: number = 0.03;
export const GRASS_TEXTURE_PATH: string = BASE_TEXTURE_PATH + "grass.jpg";
export const PATH_TO_STATRINGLINE: string = BASE_TEXTURE_PATH + "startingLineTexture.jpg";
export const GROUND_TEXTURE_FACTOR: number = 800;
export const WALL_TEXTURE_PATH: string = BASE_TEXTURE_PATH + "brick.jpg";

// Sound Paths
const BASE_SOUND_PATH: string = BASE_ASSETS_PATH + "../../assets/sounds/";
export const MUSIC_PATH: string = BASE_SOUND_PATH + "rainbowRoad.mp3";
export const ACCELERATION_PATH: string = BASE_SOUND_PATH + "carSound.mp3";
export const START_SOUND_1_PATH: string = BASE_SOUND_PATH + "StartSound3.mp3";
export const START_SOUND_2_PATH: string = BASE_SOUND_PATH + "StartSound2.mp3";
export const START_SOUND_3_PATH: string = BASE_SOUND_PATH + "StartSound1.mp3";
export const START_SOUND_GO_PATH: string = BASE_SOUND_PATH + "StartSound4.mp3";
export const CAR_COLLISION_PATH: string = BASE_SOUND_PATH + "carCollision.mp3";
export const WALL_COLLISION_PATH: string = BASE_SOUND_PATH + "wallCollision.mp3";

export const WALL_TEXTURE_FACTOR: number = 1;

export const ACCELERATE_KEYCODE: number = 87;       // w
export const LEFT_KEYCODE: number = 65;             // a
export const BRAKE_KEYCODE: number = 83;            // s
export const RIGHT_KEYCODE: number = 68;            // d
export const DAY_KEYCODE: number = 74;              // j
export const DEBUG_KEYCODE: number = 48;            // 0
export const MUTE_KEYCODE: number = 77;             // m
export const CHANGE_CAMERA_KEYCODE: number = 67;    // c
export const MUSIC_KEYCODE: number = 80;       // p
