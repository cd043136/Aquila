import settings from "../../settings"
import { registerWhen } from "../../utils/triggers"
import { getMatchFromLines, getSlotCenter } from "../../utils/utils"

const NAMES = [
    "Master Mode Catacombs",
    "The Catacombs"
]

registerWhen(register("postGuiRender", () => {
    const cont = Player.getContainer()

    let chestSlots = cont.getItems().map((item, index) => NAMES.some(name => item?.getName()?.removeFormatting() === name) ? index : null).filter(i => i != null)
    if (!chestSlots.length) return

    chestSlots.forEach(slot => {
        let item = cont.getStackInSlot(slot)
        let opened = getMatchFromLines(/Chests expire in (.+)\!/, item.getLore().map(i => i.removeFormatting()))

        if (opened) {
            let [x, y] = getSlotCenter(slot)
            Renderer.translate(x - 8, y - 8, 50)
            Renderer.drawRect(Renderer.color(255, 0, 0, 255), 0, 0, 16, 16)
        }
    })

}), () => settings.croesusOverlay && Player.getContainer() && Player.getContainer().getName() === "Croesus")
