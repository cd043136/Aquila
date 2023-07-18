import settings from "./settings"
import axios from "../axios"
import { clientChat, clientWarning } from "./utils/utils"
import { data } from "./data/pog"
import { Colour, Format } from "./utils/constants"
// BIG TODO: osu! in minecraft pog
// another TODO: docstrings for functions

import "./data/location"
import "./utils/slayer"
import "./utils/triggers"
import "./utils/forgeevents"

import "./features/debug/sound"

import "./features/dungeons/starmobs"

import "./features/general/logo"

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

register("command", (...args) => {
    if (args == null || !args.length) settings.openGUI()

    else if (args[0] == "help" || args[0] == "commands") {
        // TODO: make this look nicer
        let helpStr = " \n- /aq setkey <api key> - sets the api key for the mod\n"
        helpStr += "- /aq testkey - tests the api key\n"
        helpStr += "- /aq (help|commands) - shows this message\n"
        clientChat(helpStr)
    }

    else if (args[0] == "setkey" && args[1] != undefined) {
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

    else if (args[0] == "testkey") {
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
    }

    else if (args[0] == "getkey") {
        ChatLib.command(`ct copy ${data.apikey}`, true)
        clientChat(`${Colour.GREEN}API key copied to clipboard!`)
    }
}).setName("aquila").setAliases("aq")

register("gameLoad", () => {
    if (data.apikey == "none") clientWarning(`NO API KEY! SET USING: ${Format.RESET}${Colour.RED}/aq setkey <key>${Format.RESET}${Colour.RED}${Format.BOLD}`)
})

register("worldLoad", () => {
    if (data.apikey == "none") clientWarning(`NO API KEY! SET USING: ${Format.RESET}${Colour.RED}/aq setkey <key>${Format.RESET}${Colour.RED}${Format.BOLD}`)
})
