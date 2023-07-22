import settings from "../../settings"
import { Colour } from "../../utils/constants"
import { slayerLocationCheck, slayerFightCheck } from "../../utils/slayer"
import { registerWhen } from "../../utils/triggers"
import { clientChat, clientWarning } from "../../utils/utils"

// to add:
// alert when boss is about to spawn (+ sound, optional)
// time taken to kill boss

let spawned = false
let spawnTime = undefined

registerWhen(register("tick", () => {
    if (slayerFightCheck() && !spawned) {
        if (settings.bossSpawnAlert) spawnAlert()
        spawned = true
        spawnTime = new Date().getTime()
        return
    }
}), () => (settings.killTimer || settings.bossSpawnAlert) && slayerLocationCheck())

register("chat", () => {
    if (!settings.killTimer || spawnTime === undefined) return

    const taken = ((new Date().getTime() - spawnTime) / 1000).toFixed(2)
    clientChat(`${Colour.AQUA}Boss took ${Colour.GOLD}${taken}${Colour.AQUA}s to kill!`)

    spawnTime = undefined
    spawned = false
}).setCriteria("  SLAYER QUEST COMPLETE!")

register("chat", () => {
    if (!settings.killTimer) return

    spawnTime = undefined
    spawned = false
}).setCriteria("  SLAYER QUEST FAILED!")

const spawnAlert = () => {
    clientWarning(`${Colour.RED} BOSS SPAWNED!`, true, "")
    // todo: play sound
}
