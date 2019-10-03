import BULLET_TYPES from "~/constants/bulletTypes";
import Bullet from "./_Bullet";
import RandomBullet from "./RandomBullet";
import AimedAtPlayerBullet from "./AimedAtPlayerBullet";
import AimedAtBottomBullet from "./AimedAtBottomBullet";
import ShotgunnerAround from "./ShotgunnerAround";
import ShotgunnerAimed from "./ShotgunnerAimed";
import Boss1SideShots from "./Boss1SideShots";
import Boss1AimedShots from "./Boss1AimedShots";
import Boss1Shrapnel from "./Boss1Shrapnel";

export { Bullet, RandomBullet, AimedAtPlayerBullet, AimedAtBottomBullet, ShotgunnerAround, ShotgunnerAimed, Boss1SideShots, Boss1AimedShots, Boss1Shrapnel };

export default {
  [BULLET_TYPES.generic]: Bullet,
  [BULLET_TYPES.random]: RandomBullet,
  [BULLET_TYPES.aimedAtPlayer]: AimedAtPlayerBullet,
  [BULLET_TYPES.aimedAtBottom]: AimedAtBottomBullet,
  [BULLET_TYPES.shotgunnerAround]: ShotgunnerAround,
  [BULLET_TYPES.shotgunnerAimed]: ShotgunnerAimed,
  [BULLET_TYPES.boss1SideShots]: Boss1SideShots,
  [BULLET_TYPES.boss1AimedShots]: Boss1AimedShots,
  [BULLET_TYPES.boss1Shrapnel]: Boss1Shrapnel,
};
