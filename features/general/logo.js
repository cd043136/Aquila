import { registerWhen } from "../../utils/triggers"
import { guiMoveHelper } from "../../utils/render"
import { data } from "../../data/pog"
import settings from "../../settings"

const IMG_PATH = "./config/ChatTriggers/modules/Aquila/assets/logo.png"

const logo = Image.fromFile(IMG_PATH)

registerWhen(register("renderOverlay", () => {
    logo.draw(data.logo.x, data.logo.y, 48, 48)

    // draw line when moving logo
    if (settings.logoMoveGui.isOpen()) {
        guiMoveHelper(data.logo.x, data.logo.y, false)
    }
}), () => settings.displayLogo || settings.logoMoveGui.isOpen())

register("dragged", (dx, dy, x, y, btn) => {
    if (settings.logoMoveGui.isOpen()) {
        data.logo.x = parseInt(x)
        data.logo.y = parseInt(y)
        data.save()
    }
})
