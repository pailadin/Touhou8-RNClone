import { Dropper, Shotgunner, Boss1 } from "#/enemies";
import { MAX_X } from "~/constants/dimensions";

const generateDropperGroup = (left = true, amount = 6, {
  startingOffset = 0.3,
  offsetIncrement = 0.05,
  reverseIncrement = false,
  delay = 200
}) => {
  let group = [];
  const sign = (left ? -1 : 1);

  for (let i = 0; i < amount; i++) {
    if (delay > 0 && group.length > 0) {
      group.push(delay);
    }

    group.push({ Component: Dropper, initialX: MAX_X * (
      startingOffset + (i * offsetIncrement * (reverseIncrement ? -1: 1))
    ) * sign });
  }

  return group;
}

export default [
  3000,
  ...generateDropperGroup(true, 6, 0.3),
  3000,
  ...generateDropperGroup(true, 6, 0.3),
  3000,
  ...generateDropperGroup(false, 6, 0.3),
  200,
  ...generateDropperGroup(false, 6, 0.3),
  1000,
  { Component: Shotgunner, initialX: -MAX_X * 0.5 },
  3000,
  { Component: Shotgunner, initialX: MAX_X * 0.5 },
  4000,
  ...generateDropperGroup(true, 6, 0.1),
  2000,
  ...generateDropperGroup(false, 6, 0.2),
  3000,
  { Component: Shotgunner, initialX: -MAX_X * 0.6 },
  { Component: Shotgunner, initialX: MAX_X * 0.6, useRedBullet: false },
  6000,
  { Component: Shotgunner, initialX: -MAX_X * 0.6, useRedBullet: false },
  { Component: Shotgunner, initialX: MAX_X * 0.6 },
  3000,
  ...generateDropperGroup(true, 6, 0.8, { reverseIncrement: true }),
  4000,
  ...generateDropperGroup(false, 6, 0.3),
  2000,
  ...generateDropperGroup(true, 6, 0.3),
  3000,
  { Component: Shotgunner, initialX: -MAX_X * 0.6 },
  { Component: Shotgunner, initialX: MAX_X * 0.6 },
  5000,
  // Mini-boss here
  // 20000,
  { Component: Shotgunner, initialX: -MAX_X * 0.6, useRedBullet: false },
  2000,
  { Component: Shotgunner, initialX: -MAX_X * 0.6 },
  ...generateDropperGroup(false, 6, 0.3),
  3000,
  ...generateDropperGroup(true, 6, 0.8, { reverseIncrement: true }),
  3000,
  { Component: Shotgunner, initialX: -MAX_X * 0.6 },
  2000,
  ...generateDropperGroup(true, 6, 0.3),
  ...generateDropperGroup(false, 6, 0.3),
  1000,
  { Component: Shotgunner, initialX: MAX_X * 0.6, useRedBullet: false },
  { Component: Shotgunner, initialX: -MAX_X * 0.6, useRedBullet: false },
  8000,
  { Component: Boss1, initialX: 0 }
]
