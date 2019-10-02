import BULLET_TYPES from "~/constants/bulletTypes"
import RandomBullet from "./RandomBullet"
import AimedAtPlayerBullet from "./AimedAtPlayerBullet"
import AimedAtBottomBullet from "./AimedAtBottomBullet"

export { RandomBullet, AimedAtPlayerBullet, AimedAtBottomBullet }

export default {
  [BULLET_TYPES.random]: RandomBullet,
  [BULLET_TYPES.aimedAtPlayer]: AimedAtPlayerBullet,
  [BULLET_TYPES.aimedAtBottom]: AimedAtBottomBullet,
}
