import { Vector3 } from "three";
import { CLIENT_URL } from "../../../../../common/constants";

export const BASE_ASSETS_PATH: string = CLIENT_URL + "assets/";
export const CURRENT_PLAYER: string = "Player_1";
export const COMPUTER_PLAYER: string = "Computer_";
export const POS_Y_AXIS: Vector3 = new Vector3(0, 1, 0);
export const NEG_Y_AXIS: Vector3 = new Vector3(0, -1, 0);
export const MAX_NUMBER_HIGHSCORES: number = 5;
