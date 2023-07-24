import settings from "../../settings"
import RenderLib from "../../../RenderLib"
import { registerWhen } from "../../utils/triggers"
import { ArmorStand } from "../../utils/constants"
import { slayerFightCheck, slayerLocationCheck } from "../../utils/slayer"

let minis = []

const inMinisArray = (entity) => {
    const copy = [...minis]
    for (let i = 0; i < copy.length; i++) {
        if (copy[i].entity.getUUID() == entity.getUUID()) return true
    }
    return false
}

const getMinisIndex = (entity) => {
    const copy = [...minis]
    for (let i = 0; i < copy.length; i++) {
        if (copy[i].entity.getUUID() == entity.getUUID()) return i
    }
    return -1
}

registerWhen(register("tick", () => {
    if (minis.length > 100) minis = []
    // minis = []

    const stands = World.getAllEntitiesOfType(ArmorStand.class)
    for (let a of stands) {
        if (inMinisArray(a)) continue
        // voidgloom
        if (a.getName().includes("Voidling Radical") || a.getName().includes("Voidling Devotee")) minis.push({
            entity: a,
            height: 3,
            width: 1,
            yoffset: -3,
            // colour
            r: 255 / 255,
            g: 255 / 255,
            b: 255 / 255
        })

        else if (a.getName().includes("Voidcrazed Maniac")) minis.push({
            entity: a,
            height: 3,
            width: 1,
            yoffset: -3,
            r: 1,
            g: 77 / 255,
            b: 77 / 255
        })

        // spider
        else if (a.getName().includes("Tarantula Beast")) minis.push({
            entity: a,
            height: 0.8,
            width: 1.75,
            yoffset: -1,
            // colour
            r: 1,
            g: 1,
            b: 1
        })

        else if (a.getName().includes("Mutant Tarantula")) minis.push({
            entity: a,
            height: 0.8,
            width: 1.75,
            yoffset: -1,
            r: 1,
            g: 77 / 255,
            b: 77 / 255
        })

        // sven
        else if (a.getName().includes("Sven Follower")) minis.push({
            entity: a,
            height: 1,
            width: 1.1,
            yoffset: -1,
            // colour
            r: 1,
            g: 1,
            b: 1
        })

        else if (a.getName().includes("Sven Alpha")) minis.push({
            entity: a,
            height: 1,
            width: 1.1,
            yoffset: -1,
            // colour
            r: 1,
            g: 0,
            b: 0
        })
    }

    minis.map(m => {
        if (ChatLib.removeFormatting(m.entity.getName()).match(/( 0❤| 0\/(.+)❤)/) || m.entity.isDead()) minis.splice(getMinisIndex(m.entity), 1)
    })
}), () => slayerLocationCheck())

registerWhen(register("renderWorld", () => {
    const renderFunc = settings.fillType == 0 ? RenderLib.drawInnerEspBox : RenderLib.drawEspBox
    const alpha = settings.fillType == 0 ? 0.727 : 1

    minis.forEach(m => {
        renderFunc(m.entity.getRenderX(), m.entity.getRenderY() + m.yoffset, m.entity.getRenderZ(), m.width, m.height, m.r, m.g, m.b, alpha, false)
    })
}), () => slayerLocationCheck())

registerWhen(register("soundPlay", (pos, name, vol, pitch, cat, event) => {
    if (Math.round(10 * vol) !== 6 || Math.abs(pos.getY() - Player.getY()) > 5 || pos.getX() - Player.getX() > 20 || pos.getZ() - Player.getZ() > 20) return

    if (settings.minibossPing) World.playSound("random.orb", 1, 1)
}), () => slayerLocationCheck() && !slayerFightCheck())

register("command", () => {
    minis.forEach(m => {
        if (ChatLib.removeFormatting(m.entity.getName()).match(/( 0❤| 0\/(.+)❤)/)) {
            ChatLib.chat(`Mini boss ${m.entity.getName()} is dead!`)
        }
        else ChatLib.chat(`Mini boss ${m.entity.getName()} is alive!`)
    })
}).setName("tm")
