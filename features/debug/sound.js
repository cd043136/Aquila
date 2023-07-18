import settings from "../../settings"
import { Colour, Format } from "../../utils/constants"
import { registerWhen } from "../../utils/triggers"
import { clientChat } from "../../utils/utils"

registerWhen(register("soundPlay", (pos, name, vol, pitch, cat, event) => {
    pp = { x: pos.getX().toFixed(2), y: pos.getY().toFixed(2), z: pos.getZ().toFixed(2) }

    if (!Player.asPlayerMP() || Player.asPlayerMP().distanceTo(pp.x, pp.y, pp.z) > settings.soundDistance || name.includes("step.")) return
    if (settings.includeSounds && !settings.includeSounds.split(",").some(s => name.includes(s))) return
    if (settings.excludeSounds && settings.excludeSounds.split(",").some(s => name.includes(s))) return

    const nname = `${ChatLib.removeFormatting(name)}${Format.RESET}`
    const vvol = `${Colour.BLUE}${vol.toFixed(3)}${Format.RESET}`
    const ppitch = `${Colour.GOLD}${pitch.toFixed(3)}${Format.RESET}`
    const p = `${Colour.YELLOW}${pp.x} ${Colour.AQUA}${pp.y} ${Colour.LIGHT_PURPLE}${pp.z}${Format.RESET}`
    // cat = `${Colour.GREEN}${cat}${Format.RESET}`

    clientChat(`${nname} || vol:${vvol} pitch:${ppitch} || ${p}`)
}), () => settings.debugSounds)
