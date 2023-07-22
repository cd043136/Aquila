import { data } from "../data/pog"
import { ArmorStand, slayerNames } from "./constants"
import { getMatchFromLines, getScoreboard, getTabList, removeUnicode, romanToNum } from "./utils"

let fightinBoss = false
let validlocation = false

// TODO: maybe a separate slayer class and specific slayer boss classes extending it

register("tick", () => {
    validlocation = locationCheck()
    fightinBoss = isFighting()
})

export const getSlayer = (full = false) => {
    const sb = getScoreboard(false)
    const index = sb.findIndex(a => a.match(/Slayer Quest/))
    if (index === -1) return null

    // return the first 2 words of scoreboard[index]
    if (full) {
        // get the 3rd word instead
        const tier = removeUnicode(sb[index - 1].split(" ")[2])
        const name = removeUnicode(sb[index - 1].split(" ").slice(0, 2).join(" "))
        return {
            tier: romanToNum(tier),
            name: name
        }
    }
    else return removeUnicode(sb[index - 1].split(" ").slice(0, 2).join(" "))
}

export const slayerLocationCheck = () => {
    return validlocation
}

export const slayerFightCheck = () => {
    return fightinBoss
}

//

const locationCheck = () => {
    if (getSlayer() === null) return false
    let area = getMatchFromLines(/Area: (.+)/, getTabList(false), "str")
    // Tarantula Broodfather
    // Riftstalker Bloodfiend
    // Inferno Demonlord

    if (getSlayer() == "Voidgloom Seraph" && (data.location == "Void Sepulture" || data.location == "Zealot Bruiser Hideout")) return true
    if (getSlayer() == "Revenant Horror" && (data.location == "Coal Mine" || data.location == "None")) return true
    if (getSlayer() == "Sven Packmaster" && (data.location == "Ruins" || area == "The Park")) return true
    if (getSlayer() == "Tarantula Broodfather" && data.location.includes("Arachne")) return true

    return false
}

const isFighting = () => {
    // TODO: unify boss spawnby and and bossStand stuff into one class/file
    const stands = World.getAllEntitiesOfType(ArmorStand.class)
    const spawnby = stands.find(e => e.getName().includes(Player.getName()) && e.getName().includes("Spawned by"))

    // boss armorstand exists in the world, check for hp
    if (spawnby) {
        const boss = stands.find(e => slayerNames.some(n => e.getName().includes(n)) && e.distanceTo(spawnby) < 3)

        if (boss) {
            const cleanName = ChatLib.removeFormatting(boss.getName())
            const hp = removeUnicode(cleanName.split(" ")[cleanName.split(" ").length - 1])

            // boss is dead
            if (hp === "0") return false
            return true
        }
    }
    return false
}