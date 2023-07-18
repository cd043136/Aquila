import settings from "./settings"

register("command", () => {
    settings.openGUI()
}).setName("aquila").setAliases("aq")
