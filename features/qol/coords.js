import settings from "../../settings"
import { registerWhen } from "../../utils/triggers"

let coordsStr = ""

registerWhen(register("renderOverlay", () => {
    coordsStr = `x: ${Math.round(Player.getX())}  y: ${Math.round(Player.getY())}  z: ${Math.round(Player.getZ())}`
    Renderer.drawString(coordsStr, Renderer.screen.getWidth() / 2 - Renderer.getStringWidth(coordsStr) / 2, 18, false)
}), () => settings.displayCoords)
