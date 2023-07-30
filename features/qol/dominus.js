import { data } from "../../data/pog"
import settings from "../../settings"
import { Colour } from "../../utils/constants"
import { guiMoveHelper } from "../../utils/render"
import { registerWhen } from "../../utils/triggers"
import { getArmorWearing, removeUnicode } from "../../utils/utils"

let crimsonCount = 0
let currentStack = 0
let lastStack = 0

const times = [0, 1, 5, 8, 11]
let time = 0

let weaponKills = {}

const DOM_SYMBOL = "ᝐ"

register("command", () => {
    const armor = getArmorWearing()
    crimsonCount = armor.filter(
        piece => piece !== null && removeUnicode(ChatLib.removeFormatting(piece.getName())).match(/Crimson (Leggings|Chestplate|Boots|Helmet)/)
    ).length

    ChatLib.chat("Player is wearing " + crimsonCount + " pieces of Crimson Armor")
    ChatLib.chat("Current Dominus stack: " + currentStack)

    Object.keys(weaponKills).forEach(uuid => {
        ChatLib.chat(uuid + ": " + weaponKills[uuid])
    })
}).setName("test")

registerWhen(register("tick", () => {
    updateCrimson()
    updateTimer()
    checkMobKill()
}), () => settings.dominusTracker)

registerWhen(register("actionBar", (event) => {
    // dominus tracker
    const actionBar = ChatLib.getChatMessage(event, true)
    const splitted = actionBar.split(" ")
    const domstack = splitted.find(x => x.includes(DOM_SYMBOL))
    const domIndex = splitted.indexOf(domstack)

    if (!domstack) currentStack = 0
    else if (currentStack === 0) currentStack = parseInt(ChatLib.removeFormatting(domstack).replace(DOM_SYMBOL, ""))

    // remove dominus from action bar
    if (settings.hideFromActionBar) {
        let temp = new TextComponent(event.message)
        splitted.splice(domIndex, 1)
        temp.setText(splitted.join(" "))
        event.message = temp.chatComponentText
    }
}), () => settings.dominusTracker)

registerWhen(register("renderOverlay", () => {
    Renderer.scale(2, 2)
    Renderer.drawString(`${Colour.GOLD}${currentStack}${DOM_SYMBOL}: ${time.toFixed(1)}s`,
        data.dominus_timer_location.x / 2,
        data.dominus_timer_location.y / 2,
        true
    )
    Renderer.scale(1, 1)
}), () => settings.dominusTracker && currentStack !== 0)

registerWhen(register("renderOverlay", () => {
    guiMoveHelper(data.dominus_timer_location.x, data.dominus_timer_location.y, !settings.dominusTracker)
}), () => settings.dominusGui.isOpen())

register("dragged", (dx, dy, x, y, btn) => {
    if (settings.dominusGui.isOpen()) {
        data.dominus_timer_location.x = parseInt(x)
        data.dominus_timer_location.y = parseInt(y)
        data.save()
    }
})

const updateCrimson = () => {
    const armor = getArmorWearing()
    crimsonCount = armor.filter(
        piece => piece !== null && removeUnicode(ChatLib.removeFormatting(piece.getName())).match(/Crimson (Leggings|Chestplate|Boots|Helmet)/)
    ).length
}

const updateTimer = () => {
    if (currentStack === 0) {
        lastStack = 0
        time = 0
        return
    }

    if (lastStack !== currentStack) {
        lastStack = currentStack
        time = times[crimsonCount]
    }

    else {
        if (time >= 0.05) time -= 0.05
        else {
            currentStack--
            if (currentStack !== 0) time = times[crimsonCount]
        }
    }
}

const checkMobKill = () => {
    // requires book of stats on dmg weapon
    if (Player.getInventory() === null) return
    const hotbar = Player.getInventory()

    for (let i = 0; i < 9; i++) {
        let item = hotbar.getStackInSlot(i)

        if (item !== null) {
            let uuid = item.getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes").getString("uuid")
            let stats = item.getNBT().getCompoundTag("tag").getCompoundTag("ExtraAttributes").getInteger("stats_book")

            if (uuid === "" || stats === 0) continue

            if (!(uuid in weaponKills)) {
                weaponKills[uuid] = stats
            }

            else if (weaponKills[uuid] !== stats) {
                currentStack += stats - weaponKills[uuid]
                weaponKills[uuid] = stats

                if (currentStack >= 10) {
                    // update with actionBar instead if not 10 stackss
                    time = times[crimsonCount] - 0.5
                    currentStack = 10
                }
                continue
            }
        }
    }
}
