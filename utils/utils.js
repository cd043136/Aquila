import axios from "../../axios"
import { data } from "../data/pog"
import { CLIENT_PREFIX } from "./constants"

export const clientChat = (msg) => {
    ChatLib.chat(CLIENT_PREFIX + msg)
}

export const clientWarning = (msg, asAlert = false, subtitle = "") => {
    if (asAlert) Client.Companion.showTitle(CLIENT_PREFIX + "§c§l" + msg, subtitle, 10, 100, 10)
    else ChatLib.chat(CLIENT_PREFIX + "§c§l" + msg)
}

export const distance2D = (x1, z1, x2, z2) => {
    return Math.hypot(x2 - x1, z2 - z1)
}

// https://api.hypixel.net/skyblock/profiles?key=${KEY}&uuid=${UUID}
// https://api.mojang.com/users/profiles/minecraft/${NAME}

export const getUUID = (playername) => {
    const url = `https://api.mojang.com/users/profiles/minecraft/${playername}`
    return axios.get(url)
}

export const getPlayerData = (uuid) => {
    const url = `https://api.hypixel.net/skyblock/profiles`
    return axios.get(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (ChatTriggers)"
        },
        query: {
            uuid: uuid,
            key: data.apikey
        }
    })
}

//
/* --- Some functions I used from BloomCore --- */
//

export const removeUnicode = (string) => typeof (string) !== "string" ? "" : string.replace(/[^\u0000-\u007F]/g, "")

export const getMatchFromLines = (regex, list, type) => {
    for (let i = 0; i < list.length; i++) {
        let match = list[i].match(regex)
        if (!match) continue
        return type == "int" ? parseInt(match[1]) : type == "float" ? parseFloat(match[1]) : match[1]
    }
    return null
}

export const getScoreboard = (formatted = false) => {
    if (!World.getWorld()) return null
    let sb = Scoreboard.getLines().map(a => a.getName())
    if (formatted) return Scoreboard.getLines()
    return sb.map(a => ChatLib.removeFormatting(a))
}

export const getTabList = (formatted = false) => {
    if (formatted) return TabList.getNames()
    return TabList.getNames().map(a => a.removeFormatting())
}

const partySpamMessages = [
    /.+ has disbanded the party!/,
    /(.+) invited (.+) to the party! They have 60 seconds to accept./,
    /-----------------------------------------------------/,
    /Party [Members|Leader:|Members:]+.+/
]

let hidingPartySpam = false
export const hidePartySpam = (ms) => {
    hidingPartySpam = true
    setTimeout(() => {
        hidingPartySpam = false
    }, ms);
}

register("chat", (e) => {
    if (!hidingPartySpam) return
    let unformatted = ChatLib.getChatMessage(e, false)
    if (partySpamMessages.some(a => unformatted.match(a))) return cancel(e)
})

export const stripRank = (rankedPlayer) => rankedPlayer.replace(/\[[\w+\+-]+] /, "").trim()
