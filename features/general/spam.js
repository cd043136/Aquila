import settings from "../../settings"
import { data } from "../../data/pog"
import { spamRegex } from "../../utils/constants"
import { addTextToSpam, guiMoveHelper, spamChatDisplay } from "../../utils/render"
import { registerWhen } from "../../utils/triggers"

register("chat", (e) => {
    // TODO: autopet toggle
    if (!settings.spamHider) return
    const msg = ChatLib.getChatMessage(e, false)

    if (checkMsg(msg)) {
        cancel(e)
        if (settings.hideType === 1) addTextToSpam(ChatLib.getChatMessage(e, true))
    }
})

registerWhen(register("renderOverlay", () => {
    spamChatDisplay()
}), () => settings.spamHider && settings.hideType === 1)

register("dragged", (dx, dy, x, y, button) => {
    if (settings.spamChatGui.isOpen()) {
        data.spam_text_location.x = parseInt(x)
        data.spam_text_location.y = parseInt(y)
        data.save()
    }
})

registerWhen(register("renderOverlay", () => {
    guiMoveHelper(data.spam_text_location.x, data.spam_text_location.y, true)
}), () => settings.spamChatGui.isOpen())

const checkMsg = (msg) => {
    for (let i = 0; i < spamRegex.length; i++) {
        if (spamRegex[i].test(msg)) return true
    }
    return false
}
