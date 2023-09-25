import settings from "../../settings"
import { SALVAGEABLE } from "../../utils/constants"
import { registerWhen } from "../../utils/triggers"
import { getSlotCenter } from "../../utils/utils"

const CONTAINER_NAMES = [
    "Booster Cookie",
    "Trades",
    "Salvage Items"
]

registerWhen(register("postGuiRender", () => {
    let inv = Player.getContainer()
    let itemSlots = inv.getItems()
        .map((item, index) => SALVAGEABLE.some(name => item?.getNBT()?.getCompoundTag("tag")?.getCompoundTag("ExtraAttributes")?.getString("id")?.startsWith(name)) ? index : null)
        .filter(i => i != null)
    //ChatLib.chat(`Found ${itemSlots.length} items to salvage`)

    itemSlots.forEach(slot => {
        // prevent rendering on the wrong inventory
        if (inv.getName() !== "Salvage Items" && slot == 49) return
        else if (inv.getName() === "Salvage Items" && slot < 54) return

        let [x, y] = getSlotCenter(slot)
        Renderer.translate(x - 8, y + 4, 100)
        Renderer.drawRect(Renderer.color(
            settings.salvageableItemsColor.getRed(),
            settings.salvageableItemsColor.getGreen(),
            settings.salvageableItemsColor.getBlue(),
            settings.salvageableItemsColor.getAlpha()
        ), 0, 0, 16, 16)
    })

}), () => settings.salvageableItems && Player.getContainer() && CONTAINER_NAMES.some(n => Player.getContainer().getName() === n))