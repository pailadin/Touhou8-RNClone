import { Dropper } from "#/enemies";
import { MAX_X, MAX_Y, LONG_DIAGONAL_LENGTH } from "~/constants/dimensions";

const generateGenericGroupDroppers = (left = false) => [
  { Component: Dropper, initialX: MAX_X * 0.8 * (left ? -1 : 1) },
  200,
  { Component: Dropper, initialX: MAX_X * 0.7 * (left ? -1 : 1) },
  200,
  { Component: Dropper, initialX: MAX_X * 0.6 * (left ? -1 : 1) },
  200,
  { Component: Dropper, initialX: MAX_X * 0.5 * (left ? -1 : 1) },
  200,
  { Component: Dropper, initialX: MAX_X * 0.4 * (left ? -1 : 1) },
  200,
  { Component: Dropper, initialX: MAX_X * 0.3 * (left ? -1 : 1) },
]

const droppersFromLeft = generateGenericGroupDroppers(true);

const droppersFromRight = generateGenericGroupDroppers(false);

export default [
  // 3000,
  ...droppersFromLeft,
  3000,
  ...droppersFromLeft,
  3000,
  ...droppersFromRight,
  200,
  ...droppersFromRight,
]
