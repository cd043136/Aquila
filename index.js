import settings from "./settings"
import axios from "../axios"
import { clientChat, clientWarning } from "./utils/utils"
import { data } from "./data/pog"
import { Colour, Format } from "./utils/constants"
// BIG TODO: osu! in minecraft pog
// another TODO: docstrings for functions
// another TODO: dragged register all in one

import "./data/location"

import "./utils/slayer"
import "./utils/triggers"
import "./utils/forgeevents"
import "./utils/render"
import "./utils/osu"

import "./features/update/updatecheck"

import "./features/debug/sound"

import "./features/dungeons/starmobs"
import "./features/dungeons/croesus"
import "./features/dungeons/salvage"

import "./features/general/logo"
import "./features/general/spam"

import "./features/kuudra/tokens"
import "./features/kuudra/kuudrapf"

import "./features/qol/coords"
import "./features/qol/deathanim"
import "./features/qol/entityrenders"

import "./features/rift/berberis"
import "./features/rift/odonata"
import "./features/rift/sound"

import "./features/slayer/warps"
import "./features/slayer/miniboss"
import "./features/slayer/eman"
import "./features/slayer/slayerxp"
import "./features/slayer/alert"
import "./features/slayer/summons"

import "./features/osu/commands"

import "./features/combat/ghost"

register("command", (...args) => {
    if (args == null || !args.length) settings.openGUI()

    else {
        switch (args[0]) {
            case "help":
            case "commands":
                let helpStr = " \n- /aq setkey <api key> - sets the api key for the mod\n"
                helpStr += "- /aq testkey - tests the api key\n"
                helpStr += "- /aq (help|commands) - shows this message\n"
                clientChat(helpStr)
                break

            case "setkey":
                if (args[1]) {
                    const akey = args[1]
                    const testurl = `https://api.hypixel.net/skyblock/news?key=${akey}`
                    // test key
                    axios.get(testurl, {
                        headers: {
                            "User-Agent": "Mozilla/5.0 (ChatTriggers)"
                        }
                    })
                        .then(res => {
                            clientChat(`${Colour.GREEN}${Format.BOLD}Successfully set API key!`)
                            data.apikey = akey
                            data.save()
                        })
                        .catch(err => {
                            if (err.code == 403) clientWarning(`${Colour.RED}${Format.BOLD}Invalid API key!`)
                            else clientWarning(`${Colour.RED}${Format.BOLD}Error setting API key! Code: ${err.code}`)
                        })
                }
                break

            case "testkey":
                const testurl = `https://api.hypixel.net/skyblock/news?key=${data.apikey}`
                axios.get(testurl, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (ChatTriggers)"
                    }
                })
                    .then(res => {
                        clientChat(`${Colour.GREEN}API key is valid!`)
                    })
                    .catch(err => {
                        clientWarning(`${Colour.RED}API key is invalid!`)
                    })
                break

            case "getkey":
                ChatLib.command(`ct copy ${data.apikey}`, true)
                clientChat(`${Colour.GREEN}API key copied to clipboard!`)
                break

            case "col":
            case "color":
            case "colour":
                ChatLib.chat(colourMsg())
                break
        }
    }
}).setName("aquila").setAliases("aq")

const colourMsg = () => {
    return `
§0BLACK
§1DARK_BLUE
§2DARK_GREEN
§3DARK_AQUA
§4DARK_RED
§5DARK_PURPLE
§6GOLD
§7GRAY
§8DARK_GRAY
§9BLUE
§aGREEN
§bAQUA
§cRED
§dLIGHT_PURPLE
§eYELLOW
§fWHITE`
}

register("gameLoad", () => {
    data.last_load = new Date().getTime()
    if (data.apikey == "none") clientWarning(`NO API KEY! SET USING: ${Format.RESET}${Colour.RED}/aq setkey <key>${Format.RESET}${Colour.RED}${Format.BOLD}`)
})

register("worldLoad", () => {
    data.last_unload = new Date().getTime()
    if (data.apikey == "none") clientWarning(`NO API KEY! SET USING: ${Format.RESET}${Colour.RED}/aq setkey <key>${Format.RESET}${Colour.RED}${Format.BOLD}`)
})
