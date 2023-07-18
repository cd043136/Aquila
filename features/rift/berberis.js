import RenderLib from "../../../RenderLib"
import settings from "../../settings"
import { data } from "../../data/pog"
import { registerWhen } from "../../utils/triggers"

let currentBlock = null
let nullCount = 0

const isWhite = (col) => {
    return col.getRed() == 255 && col.getGreen() == 255 && col.getBlue() == 255
}

const inLocation = () => {
    return data.location == "Dreadfarm" || data.location == "West Village"
}

registerWhen(register("spawnParticle", (p, t, e) => {
    if (settings.reduceBerberisParticles) {
        if (t.toString() == "SPELL_WITCH" && p.getColor().getGreen() == 0) return cancel(e)
    }

    if (!t.toString().includes("FIREWORKS") || !isWhite(p.getColor()) || p.distanceTo(Player.asPlayerMP()) > 10) {
        if (nullCount < 727) nullCount++
        else currentBlock = null
        return
    }

    currentBlock = {
        x: p.getX(),
        y: Math.floor(p.getY()),
        z: p.getZ()
    }
    nullCount = 0
}), () => inLocation() && (settings.berberisHelper || settings.reduceBerberisParticles))

registerWhen(register("renderWorld", () => {
    if (!currentBlock) return
    RenderLib.drawEspBox(currentBlock.x, currentBlock.y, currentBlock.z, 1, 1, 1, 1, 1, 1, 1)
}), () => inLocation() && (settings.berberisHelper))
