import settings from "../../settings"
import { registerWhen } from "../../utils/triggers"
import { ArmorStand, Format } from "../../utils/constants"
import { slayerFightCheck, slayerLocationCheck } from "../../utils/slayer"
import { guiMoveHelper } from "../../utils/render"
import { data } from "../../data/pog"

let summons = []

registerWhen(register("tick", () => {
    summons = World.getAllEntitiesOfType(ArmorStand).filter(e => isPlayerSummons(e))
}), () => settings.summonsHP && (slayerLocationCheck() || slayerFightCheck()))

registerWhen(register("renderOverlay", () => {
    let i = 0
    if (summons.length) {  // just in case
        for (let e of summons) {
            Renderer.drawString(getSummonHP(e), data.summons_hp_location.x, data.summons_hp_location.y + (i * 10), true)
            i++
        }
    }
}), () => settings.summonsHP && summons.length > 0)

registerWhen(register("renderOverlay", () => {
    guiMoveHelper(data.summons_hp_location.x, data.summons_hp_location.y, !(settings.summonsHP && summons.length > 0))
}), () => settings.summonsGui.isOpen())

register("dragged", (dx, dy, x, y, btn) => {
    if (settings.summonsGui.isOpen()) {
        data.summons_hp_location.x = parseInt(x)
        data.summons_hp_location.y = parseInt(y)
        data.save()
    }
})

const isPlayerSummons = (entity) => {
    return entity.getName().includes("'s") && entity.getName().includes(Player.getName()) && entity.getName().includes("❤")
}

const getSummonHP = (entity) => {
    // return entity name splitted, excluding the first part
    // §a§oincliner's Tank Zombie§r §a60000§c❤
    let split = entity.getName().split(" ")
    const hp = " §a§o-§r " + Format.BOLD + split[split.length - 1]
    return "§a§o" + split.slice(1, split.length - 1).join(" ") + hp
}
