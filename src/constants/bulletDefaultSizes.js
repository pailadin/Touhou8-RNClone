import { vh } from "react-native-expo-viewport-units";

const DEFAULT_INNER_SIZE = vh(1.5);
const DEFAULT_OUTER_SIZE = DEFAULT_INNER_SIZE + vh(2);
const DEFAULT_HITBOX_SIZE = vh(1.5);

export default {
  inner: DEFAULT_INNER_SIZE,
  outer: DEFAULT_OUTER_SIZE,
  hitbox: DEFAULT_HITBOX_SIZE,
}
