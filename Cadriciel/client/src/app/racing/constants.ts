export const STRAIGHT_ANGLE_DEG: number = 180;
export const DEG_TO_RAD: number = Math.PI / STRAIGHT_ANGLE_DEG;
export const MIN_TO_SEC: number = 60;
export const MS_TO_SECONDS: number = 1000;
export const GRAVITY: number = -9.81;
export const RAD_TO_DEG: number = STRAIGHT_ANGLE_DEG / Math.PI;
// tslint:disable-next-line:no-magic-numbers
export const HALF: number = 1 / 2;
// tslint:disable-next-line:no-magic-numbers
export const PI_OVER_2: number = Math.PI / 2;
// tslint:disable-next-line:no-magic-numbers
export const PI_OVER_4: number = Math.PI / 4;
export const SQUARED: number = 2;

export const HALF_TRACK_WIDTH: number = 10;
export const LOWER_GROUND: number = 0.01;
export const SKYBOX_SIZE: number = 700;

export const WHITE: number = 0xFFFFFF;
export const PINK: number = 0xFF00BF;
export const BLUE: number = 0x0066FF;
export const RED: number = 0xFF0000;
export const GREEN: number = 0x00FF00;
export const ORANGE: number = 0xFF6600;
export const YELLOW: number = 0xFFFF00;

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
export const GROUND_SIZE: number = 10000;
export const GROUND_TEXTURE_FACTOR: number = 0.045;
export const ASPHALT_TEXTURE: string = BASE_TEXTURE_PATH + "asphalte.jpg";
export const GRASS_TEXTURE: string = BASE_TEXTURE_PATH + "green-grass-texture.jpg";
