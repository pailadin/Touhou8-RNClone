import {  distance } from "mathjs"

export const calculateDuration = (startXY, endXY, speed = 0.3) => {
  const { x: startX = 0, y: startY = 0 } = startXY;
  const { x: endX = 0, y: endY = 0 } = endXY;

  return distance([startX, startY], [endX, endY]) / speed;
}
