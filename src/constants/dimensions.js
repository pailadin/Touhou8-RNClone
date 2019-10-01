import { vw, vh } from "react-native-expo-viewport-units";

export const PLAY_AREA_HEIGHT_VH = 80;
export const PLAY_AREA_WIDTH_VW = 90;

export const LONG_DIAGONAL_LENGTH =  Math.sqrt(Math.pow(PLAY_AREA_HEIGHT_VH, 2) + Math.pow(PLAY_AREA_WIDTH_VW, 2));
export const MAX_X = vw((PLAY_AREA_WIDTH_VW/2));
export const MAX_Y = vh((PLAY_AREA_HEIGHT_VH/2));

export const MAX_X_PLAYER = vw((PLAY_AREA_WIDTH_VW/2));
export const MAX_Y_PLAYER = vh((PLAY_AREA_HEIGHT_VH/2));

export const PLAYER_HITBOX_SIZE = vh(1.5);
