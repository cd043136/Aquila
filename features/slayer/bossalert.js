import settings from "../../settings";
import { Colour, Format } from "../../utils/constants";
import { slayerLocationCheck, slayerFightCheck } from "../../utils/slayer";
import { registerWhen } from "../../utils/triggers";

let bossSpawned = false
let failed = false
let stopRinging = true
let n = 1

registerWhen(register("tick", () => {
    // sound
    if (!stopRinging) {
        n = ((n + 1) % 2)
        World.playSound("note.pling", 1, n)
    }

    // boss spawns
    if (slayerFightCheck() && !bossSpawned) {
        // alert
        bossSpawned = true
        stopRinging = false
        n = 1
        setTimeout(() => { stopRinging = true }, 750)
        bossAlert()
        return
    }

    // boss dies
    if (!slayerFightCheck() && bossSpawned) {
        bossSpawned = false

        setTimeout(() => {
            if (failed) return failed = false
            else bossDied()
        }, 250)
    }
}), () => slayerLocationCheck() && settings.bossAlert)

const bossAlert = () => {
    Client.showTitle(`${Format.BOLD}${Colour.RED}BOSS SPAWNED!`, "", 0, 20, 2)
}

const bossDied = () => {
    Client.showTitle(`${Format.BOLD}${Colour.GREEN}BOSS SLAIN!`, "", 0, 20, 2)
}

register("chat", (a, b, c) => {
    if (b === "FAILED") failed = true
}).setCriteria(/(  SLAYER QUEST (FAILED|STARTED)!)|(Your Slayer Quest has been cancelled!)/)
