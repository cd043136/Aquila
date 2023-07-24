import settings from "../../settings"
import { data } from "../../data/pog"
import { getSlayer, slayerLocationCheck } from "../../utils/slayer"
import { registerWhen } from "../../utils/triggers"
import { clientChat, numToComma } from "../../utils/utils"
import { Colour, Format, SlayerXP } from "../../utils/constants"
import { guiMoveHelper } from "../../utils/render"

let slayer = {
    name: "",
    tier: 0,
    xpreward: 0,
    remaining: -1,
    remainingRaw: "",
    remainingBoss: -1
}

registerWhen(register("tick", () => {
    const slayerData = getSlayer(true)
    if (slayerData === null) {
        reset()
        return
    }
    slayer.name = slayerData.name
    slayer.tier = slayerData.tier
    slayer.xpreward = SlayerXP[slayerData.tier]

    if (slayer.remaining === -1 && data.slayer[slayerDataName(slayer.name)].remaining !== 0) {
        slayer.remaining = data.slayer[slayerDataName(slayer.name)].remaining
        slayer.remainingRaw = numToComma(slayer.remaining)
    }

    if (slayer.remaining !== -1) slayer.remainingBoss = Math.ceil(slayer.remaining / slayer.xpreward)
}), () => settings.progressOverlay && slayerLocationCheck())

registerWhen(register("renderOverlay", () => {
    let overlayText = ""
    if (slayer.tier !== 0) overlayText += `${Colour.AQUA}Slayer:${Format.RESET}${Colour.YELLOW} ${slayer.name}\n`
    else overlayText += `${Colour.AQUA}Slayer:${Format.RESET}${Colour.YELLOW} None\n`

    if (slayer.remaining !== -1) {
        if (slayer.remaining !== Infinity) {
            overlayText += `${Colour.AQUA}Next LVL:${Format.RESET}${Colour.YELLOW} ${slayer.remainingRaw} XP`
            overlayText += `\n${Colour.AQUA}Bosses:${Format.RESET}${Colour.YELLOW} ${numToComma(slayer.remainingBoss)} left`
        }

        else overlayText += `${Colour.AQUA}Next LVL:${Format.RESET}${Colour.YELLOW} MAX LEVEL`
    }

    Renderer.drawString(overlayText, data.slayer_overlay_location.x, data.slayer_overlay_location.y, true)
}), () => settings.progressOverlay && slayerLocationCheck())

register("chat", (s, lvl, remaining) => {
    slayer.remaining = parseInt(remaining.replace(/,/g, ""))
    slayer.remainingRaw = remaining
    updateSlayerData(slayer.remaining, parseInt(lvl))
}).setCriteria("   ${s} LVL ${lvl} - Next LVL in ${remaining} XP!")

register("chat", (s, lvl, remaining) => {
    slayer.remaining = Infinity
    updateSlayerData(undefined, 9)
}).setCriteria("   ${s} LVL ${lvl} - LVL MAXED OUT!")

register("chat", () => {
    reset()
}).setCriteria("Your Slayer Quest has been cancelled!")

register("dragged", (dx, dy, x, y, button) => {
    if (settings.slayerOvGui.isOpen()) {
        data.slayer_overlay_location.x = parseInt(x)
        data.slayer_overlay_location.y = parseInt(y)
        data.save()
    }
})

registerWhen(register("renderOverlay", () => {
    guiMoveHelper(data.slayer_overlay_location.x, data.slayer_overlay_location.y, slayer.name === "")
}), () => settings.slayerOvGui.isOpen())

const reset = () => {
    slayer = {
        name: "",
        tier: 0,
        xpreward: 0,
        remaining: -1,
        remainingRaw: "",
        remainingBoss: -1
    }
}

const updateSlayerData = (remaining = undefined, lvl = undefined) => {
    const name = slayerDataName(slayer.name)
    // get slayer name


    if (remaining && data.slayer[name].remaining !== remaining) {
        data.slayer[name].remaining = remaining
        data.save()
    }

    if (lvl && data.slayer[name].level !== lvl) {
        data.slayer[name].level = lvl
        data.save()
    }
}

const slayerDataName = (n) => {
    let name = null
    if (n === "Revenant Horror") name = "rev"
    else if (n === "Tarantula Broodfather") name = "tara"
    else if (n === "Sven Packmaster") name = "sven"
    else if (n === "Voidgloom Seraph") name = "eman"
    else if (n === "Riftstalker Bloodfiend") name = "vamp"
    else if (n === "Inferno Demonlord") name = "blaze"

    return name
}
