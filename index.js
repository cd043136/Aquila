import settings from "./settings"

import "./utils/slayer"
import "./utils/triggers"
import "./utils/forgeevents"

import "./features/general/logo"

register("command", () => {
    settings.openGUI()
}).setName("aquila").setAliases("aq")
