import settings from "../../settings"
import RenderLib from "../../../RenderLib"
import { ArmorStand } from "../../utils/constants"
import { registerWhen } from "../../utils/triggers"
import { data } from "../../data/pog"

let odonatas = []

// TODO: use texture instead?
const isOdonata = (entity) => {
    return (
        entity.getWidth() == 0.5 &&
        entity.getY() > 87 &&
        // entity.getName().includes("Armor Stand") &&
        entity.getEntity().func_71124_b(0) !== null
    )
}

register("step", () => {
    odonatas = World.getAllEntitiesOfType(ArmorStand).filter((e) => isOdonata(e))
}).setFps(5)

registerWhen(register("renderWorld", () => {
    odonatas.forEach(
        (e) => RenderLib.drawEspBox(
            e.getX(),
            e.getY() + 0.9,
            e.getZ(),
            0.15,  // width
            0.15,  // height
            settings.odonataColor.getRed() / 255,  // r
            settings.odonataColor.getGreen() / 255,  // g
            settings.odonataColor.getBlue() / 255,  // b
            settings.odonataColor.getAlpha() / 255,
            0  // 1 = through walls (bad!), 0 = not through walls
        )
    )
}), () => data.location == "Wyld Woods" && settings.odonataHelper)
