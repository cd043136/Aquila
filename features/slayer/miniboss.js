import settings from "../../settings"
import RenderLib from "../../../RenderLib"
import { registerWhen } from "../../utils/triggers"
import { ArmorStand } from "../../utils/constants"
import { slayerFightCheck, slayerLocationCheck } from "../../utils/slayer"

let minis = []

registerWhen(register("tick", () => {
    minis = []
    World.getAllEntitiesOfType(ArmorStand.class).forEach(a => {
        // include short name?
        if (a.getName().includes("Voidling Radical") || a.getName().includes("Voidling Devotee")) minis.push({
            height: 3,
            width: 1,
            x: a.getRenderX(),
            y: a.getRenderY() - 3,
            z: a.getRenderZ(),
            // colour
            r: 255 / 255,
            g: 255 / 255,
            b: 255 / 255
        })

        else if (a.getName().includes("Voidcrazed Maniac")) minis.push({
            height: 3,
            width: 1,
            x: a.getRenderX(),
            y: a.getRenderY() - 3,
            z: a.getRenderZ(),
            // colour
            r: 1,
            g: 77 / 255,
            b: 77 / 255
        })
    })
}), () => slayerLocationCheck())

registerWhen(register("renderWorld", () => {
    const renderFunc = settings.fillType == 0 ? RenderLib.drawInnerEspBox : RenderLib.drawEspBox
    const alpha = settings.fillType == 0 ? 0.727 : 1

    minis.forEach(m => {
        renderFunc(m.x, m.y, m.z, m.width, m.height, m.r, m.g, m.b, alpha, false)
    })
}), () => slayerLocationCheck())

registerWhen(register("soundPlay", (pos, name, vol, pitch, cat, event) => {
    if (Math.round(10 * vol) !== 6 || Math.abs(pos.getY() - Player.getY()) > 5 || pos.getX() - Player.getX() > 20 || pos.getZ() - Player.getZ() > 20) return

    if (settings.minibossPing) World.playSound("random.orb", 1, 1)
}), () => slayerLocationCheck() && !slayerFightCheck())
