import { MAX_X, MAX_Y } from "~/constants/dimensions";

export const getRandomSign = () => Math.random() > 0.5 ? 1 : -1

export const getRandomX = () => (Math.random() * MAX_X) * getRandomSign();

export const getRandomY = () => (Math.random() * MAX_Y) * getRandomSign();

export const getRandomXOffset = (a = 10, b = 0) => ((Math.random() * (MAX_X * (a/200))) + (MAX_X * (b/200))) * getRandomSign();
export const getRandomXOffsetAbs = (a = 10, b = 0) => ((Math.random() * (MAX_X * (a/100))) + (MAX_X * (b/100)));

export const getRandomYOffset = (a = 10, b = 0) => ((Math.random() * (MAX_Y * (a/200))) + (MAX_Y * (b/200))) * getRandomSign();
export const getRandomYOffsetAbs = (a = 10, b = 0) => ((Math.random() * (MAX_Y * (a/100))) + (MAX_Y * (b/100)));

export default { getRandomSign, getRandomX, getRandomY, getRandomXOffset, getRandomXOffsetAbs, getRandomYOffset, getRandomYOffsetAbs }
