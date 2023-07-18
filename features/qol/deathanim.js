import settings from "../../settings"
import { registerWhen } from "../../utils/triggers"

registerWhen(register("entityDeath", (entity) => {
    entity.getEntity().func_70106_y()
}), () => settings.noDeathAnimation)
