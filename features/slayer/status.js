import settings from "../../settings"
import { Colour } from "../../utils/constants"
import { slayerLocationCheck, slayerFightCheck } from "../../utils/slayer"
import { registerWhen } from "../../utils/triggers"
import { clientChat, clientWarning } from "../../utils/utils"

// TODO: fix this

let spawned = false
let spawnTime = undefined
let failed = false

registerWhen(register("tick", () => {
    if (slayerFightCheck() && !spawned && !failed) {
        if (settings.bossSpawnAlert) spawnAlert()
        spawned = true
        spawnTime = new Date().getTime()
        return
    }

    if (!slayerFightCheck() && spawned && !failed) {
        // quest complete msg is delayed by a bit
        const taken = ((new Date().getTime() - spawnTime) / 1000).toFixed(2)
        clientChat(`${Colour.AQUA}Boss took ${Colour.GOLD}${taken}${Colour.AQUA}s to kill!`)

        spawnTime = undefined
        spawned = false
        return
    }
}), () => (settings.killTimer || settings.bossSpawnAlert) && slayerLocationCheck())

/*register("chat", () => {
    if (!settings.killTimer || spawnTime === undefined) return

    // quest complete msg is delayed by a bit
    const taken = ((new Date().getTime() - 866 - spawnTime) / 1000).toFixed(2)
    clientChat(`${Colour.AQUA}Boss took ${Colour.GOLD}${taken}${Colour.AQUA}s to kill!`)

    setTimeout(() => {
        spawnTime = undefined
        spawned = false
    }, 250)
}).setCriteria("  SLAYER QUEST COMPLETE!")*/

register("chat", () => {
    if (!settings.killTimer) return

    spawnTime = undefined
    spawned = false
    failed = true
    setTimeout(() => failed = false, 500)
}).setCriteria("  SLAYER QUEST FAILED!")

const spawnAlert = () => {
    clientWarning(`${Colour.RED} BOSS SPAWNED!`, true, "")

    let n = 0
    let pitch = -1
    new Thread(() => {
        while (n <= 16) {
            World.playSound("random.orb", 1, Math.abs(pitch))
            Thread.sleep(38)
            n++
            pitch += 0.1
        }
    }).start()
}
