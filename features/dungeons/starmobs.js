import settings from "../../settings"
import RenderLib from "../../../RenderLib"
import { data } from "../../data/pog"
import { registerWhen } from "../../utils/triggers"
import { ArmorStand } from "../../utils/constants"

const ESP_NAMES = ["✯", "﴾", "Shadow Assassin", "Adventurer", "Archaeologist", "King Midas"]
let starMobs = []

registerWhen(register("tick", () => {
    starMobs = World.getAllEntitiesOfType(ArmorStand).filter(entity =>
        !entity.getName().includes(",") &&
        !entity.getName().includes("Livid") &&
        ESP_NAMES.some(a => entity.getName().includes(a)) &&
        Player.asPlayerMP().distanceTo(entity) <= settings.starMobsDistance
    )
}), () => data.location == "Catacombs" && settings.boxStarMobs)

registerWhen(register("renderWorld", () => {
    starMobs.forEach(entity => {
        RenderLib.drawEspBox(
            entity.getRenderX(),
            entity.getRenderY() - 2,
            entity.getRenderZ(),
            0.6,
            2,
            settings.starMobsColor.getRed() / 255,
            settings.starMobsColor.getGreen() / 255,
            settings.starMobsColor.getBlue() / 255,
            1,
            0
        )
    })
}), () => data.location == "Catacombs" && settings.boxStarMobs)
