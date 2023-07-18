import settings from "../../settings"
import { data } from "../../data/pog"
import { registerWhen } from "../../utils/triggers"

registerWhen(register("soundPlay", (pos, name, vol, pitch, cat, ev) => {
    if (name == "portal.travel") cancel(ev)
}), () => settings.suppressTravelSound && data.area == "The Rift")