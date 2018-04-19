import { BASE_ASSETS_PATH } from "./global.constants";
import { LineBasicMaterial, MeshBasicMaterial } from "three";
import { RED, WHITE, PINK, BLUE } from "./color.constants";

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
export const GRASS_TEXTURE_PATH: string = BASE_TEXTURE_PATH + "grass.jpg";
export const STARTING_LINE_PATH: string = BASE_TEXTURE_PATH + "startingLineTexture.jpg";
export const WALL_TEXTURE_PATH: string = BASE_TEXTURE_PATH + "brick.jpg";

export const ASPHALT_TEXTURE_FACTOR: number = 0.03;
export const GROUND_TEXTURE_FACTOR: number = 800;
export const STARTING_LINE_X_FACTOR: number = 2;
export const STARTING_LINE_Y_FACTOR: number = 1;
export const WALL_TEXTURE_FACTOR: number = 1;

export const UNAUTHORIZED_LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial({ color: RED });
export const SIMPLE_LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial({ color: WHITE });
export const START_VERTEX_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial({ color: PINK });
export const SIMPLE_VERTEX_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial({ color: BLUE });
