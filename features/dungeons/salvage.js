import settings from "../../settings"
import { DUNGEON_SELLABLE, SALVAGEABLE } from "../../utils/constants"
import { registerWhen } from "../../utils/triggers"
import { getSlotCenter } from "../../utils/utils"

const CONTAINER_NAMES = [
    "Booster Cookie",
    "Trades",
    "Salvage Items"
]

registerWhen(register("guiRender", () => {
    let inv = Player.getContainer()
    let itemFilter = settings.includeNonSalvageable ? SALVAGEABLE.concat(DUNGEON_SELLABLE) : SALVAGEABLE
    let itemSlots = inv.getItems()
        .map((item, index) => itemFilter.some(name => item?.getNBT()?.getCompoundTag("tag")?.getCompoundTag("ExtraAttributes")?.getString("id")?.startsWith(name)) ? index : null)
        .filter(i => i != null)

    for (let slot of itemSlots) {
        // prevent rendering on the wrong inventory
        if (inv.getName() !== "Salvage Items" && slot == 49) continue
        else if (inv.getName() === "Salvage Items" && slot < 54) continue

        let [x, y] = getSlotCenter(slot)
        Renderer.translate(x - 8, y + 4, 50)
        Renderer.drawRect(Renderer.color(
            settings.salvageableItemsColor.getRed(),
            settings.salvageableItemsColor.getGreen(),
            settings.salvageableItemsColor.getBlue(),
            settings.salvageableItemsColor.getAlpha()
        ), 0, 0, 16, 16)
    }

}), () => settings.salvageableItems && Player.getContainer() && CONTAINER_NAMES.some(n => Player.getContainer().getName() === n))