import settings from "../../settings";
import { Colour, Format } from "../../utils/constants";
import { slayerLocationCheck, slayerFightCheck } from "../../utils/slayer";
import { registerWhen } from "../../utils/triggers";

let bossSpawned = false
let stopRinging = true
let n = 1  // cycle between 0 1

registerWhen(register("tick", () => {
    if (slayerFightCheck() && !bossSpawned) {
        // alert
        bossSpawned = true
        stopRinging = false
        n = 1
        setTimeout(() => { stopRinging = true }, 500)
        bossAlert()
        return
    }
    if (!slayerFightCheck() && bossSpawned) {
        bossSpawned = false
        bossDied()
    }

    if (!stopRinging) {
        n = (n + 1) % 2
        World.playSound("note.pling", 1, n)
    }
}), () => slayerLocationCheck())

const bossAlert = () => {
    Client.showTitle(`${Format.BOLD}${Colour.RED}BOSS SPAWNED!`, "", 0, 20, 2)
}

const bossDied = () => {
    Client.showTitle(`${Format.BOLD}${Colour.GREEN}BOSS SLAIN!`, "", 0, 20, 2)
}
