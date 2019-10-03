import BULLET_TYPES from "~/constants/bulletTypes";
import Bullet from "./_Bullet";
import RandomBullet from "./RandomBullet";
import AimedAtPlayerBullet from "./AimedAtPlayerBullet";
import AimedAtBottomBullet from "./AimedAtBottomBullet";
import ShotgunnerAround from "./ShotgunnerAround";
import ShotgunnerAimed from "./ShotgunnerAimed";

export { Bullet, RandomBullet, AimedAtPlayerBullet, AimedAtBottomBullet, ShotgunnerAround, ShotgunnerAimed };

export default {
  [BULLET_TYPES.generic]: Bullet,
  [BULLET_TYPES.random]: RandomBullet,
  [BULLET_TYPES.aimedAtPlayer]: AimedAtPlayerBullet,
  [BULLET_TYPES.aimedAtBottom]: AimedAtBottomBullet,
  [BULLET_TYPES.shotgunnerAround]: ShotgunnerAround,
  [BULLET_TYPES.shotgunnerAimed]: ShotgunnerAimed,
};
