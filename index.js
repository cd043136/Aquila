import settings from "./settings"

import "./features/general/logo"

register("command", () => {
    settings.openGUI()
}).setName("aquila").setAliases("aq")
