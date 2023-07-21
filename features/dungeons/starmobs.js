import settings from "../../settings"
import RenderLib from "../../../RenderLib"
import { data } from "../../data/pog"
import { registerWhen } from "../../utils/triggers"
import { ArmorStand } from "../../utils/constants"

const ESP_NAMES = ["✯", "﴾", "Shadow Assassin", "Adventurer", "Archaeologist", "King Midas"]
let starMobs = []


const inStarMobs = (entity) => {
    const copy = [...starMobs]
    for (let i = 0; i < copy.length; i++) {
        if (copy[i].getUUID() == entity.getUUID()) return true
    }
    return false
}

const getStarMobIndex = (entity) => {
    const copy = [...starMobs]
    for (let i = 0; i < copy.length; i++) {
        if (copy[i].getUUID() == entity.getUUID()) return i
    }
    return -1
}

registerWhen(register("tick", () => {
    const mobs = World.getAllEntitiesOfType(ArmorStand).filter(entity =>
        !entity.getName().includes(",") &&
        !entity.getName().includes("Livid") &&
        ESP_NAMES.some(a => entity.getName().includes(a))
    )

    for (let mob of mobs) {
        if (inStarMobs(mob)) continue
        else starMobs.push(mob)
    }

    mobs.map(mob => {
        if (mob.isDead()) {
            starMobs.splice(getStarMobIndex(mob), 1)
        }
    })
}), () => data.location == "Catacombs" && settings.boxStarMobs)

registerWhen(register("renderWorld", () => {
    starMobs.forEach(entity => {
        // TODO: filter distance
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
