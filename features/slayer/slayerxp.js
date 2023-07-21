import settings from "../../settings"
import { data } from "../../data/pog"
import { getSlayer, slayerLocationCheck } from "../../utils/slayer"
import { registerWhen } from "../../utils/triggers"
import { clientChat, numToComma } from "../../utils/utils"
import { Colour, Format, SlayerXP } from "../../utils/constants"

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
}).setCriteria("   ${s} LVL ${lvl} - Next LVL in ${remaining} XP!")

register("chat", (s, lvl, remaining) => {
    slayer.remaining = Infinity
}).setCriteria("   ${s} LVL ${lvl} - LVL MAXED OUT!")

register("command", () => {
    clientChat(`Slayer: ${slayer.name} tier ${slayer.tier}. Remaining: ${slayer.remaining}XP (${slayer.remainingBoss} bosses)`)
}).setName("txp")

const reset = () => {
    slayer.name = ""
    slayer.tier = 0
    slayer.xpreward = 0
    slayer.remaining = -1
    slayer.remainingRaw = ""
    slayer.remainingBoss = -1
}
