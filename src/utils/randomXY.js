import { MAX_X, MAX_Y } from "~/constants/dimensions";

export const getRandomX = () => (Math.random() * MAX_X) * (Math.random() > 0.5 ? 1 : -1)

export const getRandomY = () => (Math.random() * MAX_Y) * (Math.random() > 0.5 ? 1 : -1)

export default { getRandomX, getRandomY }
