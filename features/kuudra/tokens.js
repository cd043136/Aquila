import settings from "../../settings"
import { data } from "../../data/pog"
import { registerWhen } from "../../utils/triggers"
import { getScoreboard, getMatchFromLines, removeUnicode } from "../../utils/utils"
import { guiMoveHelper } from "../../utils/render"
import { KDR_SLOTS } from "../../utils/constants"

let tokens = -1
let tokenText = ""
let playerClass = null
let thing = {
    12: {
        name: "",
        cost: -1
    },
    13: {
        name: "",
        cost: -1
    },
    14: {
        name: "",
        cost: -1
    },
    21: {
        name: "",
        cost: -1
    },
    22: {
        name: "",
        cost: -1
    },
    23: {
        name: "",
        cost: -1
    },
}

registerWhen(register("tick", () => {
    tokens = parseInt(removeUnicode(getMatchFromLines(/Tokens: (.+)/, getScoreboard(false))))

    tokenText = ""
    KDR_SLOTS.forEach(slot => {
        let { name, cost } = thing[slot]
        if (name && cost != null && tokens !== -1) tokenText += tokens >= cost ? `§a§l${name}:§r§a ${cost} ✓§r\n` : `§c§l${name}:§r§c ${cost}§r\n`
    })
}), () => settings.tokenShopHelper && data.location == "Kuudra")

registerWhen(register("renderOverlay", () => {
    Renderer.drawStringWithShadow(tokenText, data.token_location.x, data.token_location.y)
}), () => settings.tokenShopHelper && data.location == "Kuudra")

registerWhen(register("renderOverlay", () => {
    guiMoveHelper(data.token_location.x, data.token_location.y)
}), () => settings.tokenGui.isOpen())

registerWhen(register("guiRender", () => {
    let inv = Player.getContainer()
    let item = inv.getStackInSlot(12)
    // 12 13 14 21 22 23

    if (!item) return
    if (item.getUnlocalizedName() == "item.chestplateGold") return // ChatLib.chat("No class selected")
    else {
        if (!playerClass) {
            if (item.getName().includes("Steady Hands")) playerClass = "specialist"
            else if (item.getName().includes("Accelerated Shot")) playerClass = "cannoneer"
            else if (item.getName().includes("Sweeping Edge")) playerClass = "cc"
            else if (item.getName().includes("Healing Aura")) playerClass = "support"
            // red error text in bold
            else return ChatLib.chat("&c&lError: &r&cInvalid class")
        }

        else {
            KDR_SLOTS.forEach(slot => {
                let upg = inv.getStackInSlot(slot)
                if (upg != null && ChatLib.removeFormatting(upg.getName()).length > 3) {  // spec does not have items in slot 21, 23
                    let lore = upg.getLore().map(line => ChatLib.removeFormatting(line))

                    thing[slot].name = ChatLib.removeFormatting(upg.getName())
                    thing[slot].cost = getMatchFromLines(/Cost: (.+) Tokens/, lore, "int")
                    // tokenText += tokens >= cost ? `§a${name}: ${cost} ✓§r\n` : `§c${name}: ${cost} ❌§r\n`
                }
            })
            // ChatLib.chat(tokenText)
        }
    }
}), () => Player.getContainer()?.getName() == "Perk Menu" && settings.tokenShopHelper && data.location == "Kuudra")

register("dragged", (dx, dy, x, y, btn) => {
    if (settings.tokenGui.isOpen()) {
        data.token_location.x = parseInt(x)
        data.token_location.y = parseInt(y)
        data.save()
    }
})

register("chat", () => {
    tokenText = ""
    playerClass = null
    tokens = -1
    thing = {
        12: {
            name: "",
            cost: -1
        },
        13: {
            name: "",
            cost: -1
        },
        14: {
            name: "",
            cost: -1
        },
        21: {
            name: "",
            cost: -1
        },
        22: {
            name: "",
            cost: -1
        },
        23: {
            name: "",
            cost: -1
        },
    }
    // ChatLib.chat("Kuudra reset")
}).setCriteria("[NPC] Elle: One last flail before admitting defeat, huh?")
// [NPC] Elle: One last flail before admitting defeat, huh?
