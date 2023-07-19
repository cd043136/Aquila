import axios from "../../../axios"
import settings from "../../settings"
import { Colour, Format } from "../../utils/constants"
import { clientChat } from "../../utils/utils"

const GH = "https://github.com/cd043136/Aquila"
const URL = "https://raw.githubusercontent.com/cd043136/Aquila/main/_version.json"

let lastUpdate = undefined
let suppressUpdate = false

register("worldLoad", () => {
    if (suppressUpdate) return

    if (!lastUpdate || new Date().getTime() - lastUpdate.getTime() > settings.updateCheckInterval * 60000) {
        if (!lastUpdate) lastUpdate = new Date()
        checkUpdate()
    }
})

register("gameLoad", () => {
    suppressUpdate = false
})

const sendUpdateMsg = (chlogs, v) => {
    // check out this abomination!
    new Message(
        `${Format.STRIKETHROUGH}${Colour.DARK_BLUE}${ChatLib.getChatBreak(Colour.DARK_BLUE + "-" + Colour.BLUE + "-")}\n`,
        ChatLib.getCenteredText(`${Format.BOLD}${Format.OBFUSCATED}     ${Format.RESET}${Format.BOLD} Aquila Update v${v} ${Format.RESET}${Format.BOLD}${Format.OBFUSCATED}     ${Format.RESET}\n`),
        new TextComponent(`${Colour.BLUE}${Format.BOLD}What's New (click here):\n${Format.RESET}`).setClick("open_url", GH).setHover("show_text", `${Colour.GRAY}Click to open the GitHub page!`),
        `${chlogs.map(e => Colour.DARK_AQUA + " > " + Format.RESET + e).join("\n")}${Format.RESET}\n\n`,
        new TextComponent(`${Colour.GRAY}${Format.ITALIC}[Disable alert]${Format.RESET}`).setClick("run_command", `/suppressupdatemsg`).setHover("show_text", `${Colour.GRAY}Click here to disable update messages until restart`),
        `\n${Format.STRIKETHROUGH}${Colour.DARK_BLUE}${ChatLib.getChatBreak(Colour.BLUE + "-" + Colour.DARK_BLUE + "-")}`
    ).chat()
}

const checkUpdate = () => {
    let data = undefined
    const metadata = JSON.parse(FileLib.read("Aquila", "metadata.json"))

    axios.get(URL, {
        "headers": { "User-Agent": "Mozilla/5.0 (ChatTriggers)" }
    })
        .then(res => {
            data = res.data

            if (metadata.version !== data.version) {
                sendUpdateMsg(data.changelog, data.version)
            }
        })
}

register("command", () => {
    if (!suppressUpdate) {
        suppressUpdate = true
        clientChat(`${Colour.GRAY}Update messages have been disabled until restart`)
    }
}).setName("suppressupdatemsg")
