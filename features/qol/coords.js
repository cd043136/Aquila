import settings from "../../settings"
import { registerWhen } from "../../utils/triggers"
import { Colour } from "../../utils/constants"

let coordsStr = ""

registerWhen(register("renderOverlay", () => {
    coordsStr = `${Colour.WHITE}x: ${Math.round(Player.getX())}  y: ${Math.round(Player.getY())}  z: ${Math.round(Player.getZ())}`
    Renderer.colorize(1, 1, 1, 255)
    Renderer.drawString(coordsStr, Renderer.screen.getWidth() / 2 - Renderer.getStringWidth(coordsStr) / 2, 18, false)
}), () => settings.displayCoords)
