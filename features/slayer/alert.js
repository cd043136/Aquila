import settings from "../../settings"
import { Colour } from "../../utils/constants"
import { getSlayer, slayerFightCheck } from "../../utils/slayer"
import { registerWhen } from "../../utils/triggers"
import { clientWarning } from "../../utils/utils"

let fighting = false
let temp = false

registerWhen(register("tick", () => {
    if (slayerFightCheck() && !fighting) {
        fighting = true
        // alert spawn
        alert()
        temp = true
    }

    else if (!slayerFightCheck() && fighting && temp) {
        temp = false // prevent setTimeout from running multiple times
        setTimeout(() => fighting = false, 200)
    }
}), () => settings.bossSpawnAlert && getSlayer() !== null)

const alert = () => {
    clientWarning(`${Colour.RED} BOSS SPAWNED!`, true, "", 50)

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
