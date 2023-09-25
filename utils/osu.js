import axios from "../../axios"
import { data } from "../data/pog"
import { CLIENT_PREFIX, Colour, Format, RANKS } from "./constants"
import { Promise } from "../../PromiseV2"
import { clientChat, numToComma } from "./utils"

// TODO: migrate to api v2
const BASE_URL = "https://osu.ppy.sh/api"

export const getRecentScore = (username) => {
    const url = `${BASE_URL}/get_user_recent?k=${data.osu_apikey}&u=${username}&type=string&limit=1`
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(response => {
                if (response.data.length) {
                    if ("error" in response.data) {
                        reject("Invalid API key")
                        return
                    }
                    resolve(response.data[0])
                }
                else reject("No recent score found")
            })
    })
}

export const getBeatmap = (beatmap_id) => {
    if (data.osu_cache.beatmaps === undefined) {
        data.osu_cache.beatmaps = {}
        data.save()
    }

    if (beatmap_id in data.osu_cache.beatmaps) return Promise.resolve(data.osu_cache.beatmaps[beatmap_id])

    const url = `${BASE_URL}/get_beatmaps?k=${data.osu_apikey}&b=${beatmap_id}`
    let saveData = {}
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(response => {
                if (response.data.length) {
                    if ("error" in response.data) {
                        reject("Invalid API key")
                        return
                    }

                    saveData = {
                        max_combo: response.data[0].max_combo,
                        artist: response.data[0].artist,
                        title: response.data[0].title,
                        version: response.data[0].version,
                        beatmapset_id: response.data[0].beatmapset_id,
                        beatmap_id: response.data[0].beatmap_id
                    }

                    data.osu_cache.beatmaps[beatmap_id] = saveData
                    data.save()
                    resolve(saveData)
                }
                else reject("No beatmap found")
            })
            .catch(err => {
                reject(err)
            })
    })
}

export const getProfile = (username) => {
    const url = `${BASE_URL}/get_user?k=${data.osu_apikey}&u=${username}&type=string&m=0`
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(response => {
                if (response.data.length) {
                    if ("error" in response.data) {
                        reject("Invalid API key")
                        return
                    }
                    resolve(response.data[0])
                }
                else reject("No user found")
            })
    })
}

const getMods = (modNums) => {
    // using MOD_ENUMS to convert from a number to a string
    let number = parseInt(modNums)
    let mod_list = []

    if (number & 1 << 0) mod_list.push('NF')
    if (number & 1 << 1) mod_list.push('EZ')
    if (number & 1 << 3) mod_list.push('HD')
    if (number & 1 << 4) mod_list.push('HR')
    if (number & 1 << 5) mod_list.push('SD')
    if (number & 1 << 9) mod_list.push('NC')
    else if (number & 1 << 6) mod_list.push('DT')
    if (number & 1 << 7) mod_list.push('RX')
    if (number & 1 << 8) mod_list.push('HT')
    if (number & 1 << 10) mod_list.push('FL')
    if (number & 1 << 12) mod_list.push('SO')
    if (number & 1 << 14) mod_list.push('PF')
    if (number & 1 << 15) mod_list.push('4 KEY')
    if (number & 1 << 16) mod_list.push('5 KEY')
    if (number & 1 << 17) mod_list.push('6 KEY')
    if (number & 1 << 18) mod_list.push('7 KEY')
    if (number & 1 << 19) mod_list.push('8 KEY')
    if (number & 1 << 20) mod_list.push('FI')
    if (number & 1 << 24) mod_list.push('9 KEY')
    if (number & 1 << 25) mod_list.push('10 KEY')
    if (number & 1 << 26) mod_list.push('1 KEY')
    if (number & 1 << 27) mod_list.push('3 KEY')
    if (number & 1 << 28) mod_list.push('2 KEY')

    return mod_list
}

const calculateAcc = (score) => {
    let totalUnscaledScore = parseFloat(score.count300)
        + parseFloat(score.count100)
        + parseFloat(score.count50)
        + parseFloat(score.countmiss)
    totalUnscaledScore *= 300

    let userScore = parseFloat(score.count300) * 300
        + parseFloat(score.count100) * 100
        + parseFloat(score.count50) * 50

    return (userScore / totalUnscaledScore) * 100.0
}

const secondsToDhms = (seconds) => {
    seconds = parseInt(seconds)
    const d = Math.floor(seconds / (3600 * 24))
    const h = Math.floor(seconds % (3600 * 24) / 3600)
    const m = Math.floor(seconds % 3600 / 60)
    const s = Math.floor(seconds % 60)

    const dDisplay = d > 0 ? d + "d" : ""
    const hDisplay = h > 0 ? h + "h" : ""
    const mDisplay = m > 0 ? m + "m" : ""
    const sDisplay = s > 0 ? s + "s" : ""

    return `${dDisplay} ${hDisplay} ${mDisplay} ${sDisplay}`
}

// TODO: Complete >rs
export const formatRecentScore = (user, score, beatmap) => {
    const rank = RANKS[score.rank]
    const mods = getMods(score.enabled_mods)
    const modstr = mods.length ? `+${mods.join("")}` : "NoMod"
    const sscore = numToComma(parseInt(score.score))
    const acc = calculateAcc(score).toFixed(2) + "%"
    const combo = `${score.maxcombo}/${beatmap.max_combo}`
    const hitRatio = `Hit Ratio: ${Format.BOLD}${Colour.GRAY}${score.count300}/${score.count100}/${score.count50}/${score.countmiss}`
    const mapUrl = `https://osu.ppy.sh/b/${beatmap.beatmap_id}`

    const bar = `${Colour.AQUA}|`
    const hoverMsg = `${Colour.WHITE}${hitRatio}\n${Colour.WHITE}Combo: ${Colour.GREEN}${combo}x\n${Colour.WHITE}Score: ${Colour.YELLOW}${sscore}`
    const line = ChatLib.getChatBreak(`${Colour.DARK_BLUE}-`)

    return new Message(
        line,
        `${CLIENT_PREFIX}${Colour.DARK_AQUA}Recent score for ${Colour.GOLD}${user}${Colour.YELLOW}:\n`,
        new TextComponent(`${Colour.AQUA}${beatmap.artist} - ${beatmap.title} [${beatmap.version}]\n`).setHover("show_text", "Click to open beatmap").setClick("open_url", mapUrl),
        `${Colour.WHITE}${modstr} ${bar} ${Colour.GRAY}${acc} ${rank} ${bar} ${Format.ITALIC} `,
        new TextComponent(`${Colour.GOLD}[More Info]`).setHover("show_text", hoverMsg),
        line
    )
}

export const formatProfile = (profileData) => {
    /**
    clickable username [pp, global rank]
    > Country Rank: US #123
    > Accuracy: 99.99%
    > Level: 100
    > Playcount: 12,345
    > Playtime: 4d 20h 15m
    [Score data, hover]  [Hit ratio data, hover]
     */
    const pp = numToComma(profileData.pp_raw)
    const rank = numToComma(profileData.pp_rank)
    const crank = numToComma(profileData.pp_country_rank)
    const rankedSc = numToComma(profileData.ranked_score)
    const totalSc = numToComma(profileData.total_score)
    const profileUrl = `https://osu.ppy.sh/users/${profileData.user_id}`
    const totalHits = parseInt(profileData.count300) + parseInt(profileData.count100) + parseInt(profileData.count50)
    const hitsPerPlay = (totalHits / parseInt(profileData.playcount)).toFixed(2)

    const ppStr = `${Colour.AQUA}> PP: ${Format.RESET}${Colour.GRAY}${pp}pp\n`
    const rankStr = `${Colour.AQUA}> Rank: ${Format.RESET}${Colour.GRAY}#${rank} (${profileData.country} #${crank})\n`
    const acc = `${Colour.AQUA}> Acc: ${Format.RESET}${Colour.GRAY}${parseFloat(profileData.accuracy).toFixed(2)}%\n`
    const level = `${Colour.AQUA}> Level: ${Format.RESET}${Colour.GRAY}${parseFloat(profileData.level).toFixed(2)}\n`
    const playcount = `${Colour.AQUA}> PlayCount: ${Format.RESET}${Colour.GRAY}${numToComma(profileData.playcount)}\n`
    const playtime = `${Colour.AQUA}> Playtime: ${Format.RESET}${Colour.GRAY}${secondsToDhms(profileData.total_seconds_played)}\n`

    const scoreDataText = `${RANKS["XH"]}: ${profileData.count_rank_ssh}
${RANKS["SH"]}: ${profileData.count_rank_ss}
${RANKS["X"]}: ${profileData.count_rank_sh}
${RANKS["S"]}: ${profileData.count_rank_s}
${RANKS["A"]}: ${profileData.count_rank_a}

${Colour.YELLOW}Ranked Score: ${rankedSc}
Total Score: ${totalSc}`

    const hitRatioText = `${Colour.AQUA}300: ${numToComma(profileData.count300)}
${Colour.GREEN}100: ${numToComma(profileData.count100)}
${Colour.YELLOW}50: ${numToComma(profileData.count50)}

${Colour.YELLOW}Total Hits: ${numToComma(totalHits)}
Hits per Play: ${hitsPerPlay}`

    const line = ChatLib.getChatBreak(`${Colour.DARK_BLUE}-`)
    return new Message(
        line,
        new TextComponent(`${CLIENT_PREFIX}${Colour.DARK_AQUA}osu!standard profile for ${Colour.GOLD}${Format.ITALIC}${profileData.username}${Colour.DARK_AQUA}:\n`)
            .setHover("show_text", "Click to open profile")
            .setClick("open_url", profileUrl),
        ppStr,
        rankStr,
        acc,
        level,
        playcount,
        playtime,
        `${Colour.AQUA}> Other: `,
        new TextComponent(`${Colour.GOLD}[Score Data]`).setHover("show_text", scoreDataText),
        "   ",
        new TextComponent(`${Colour.GOLD}[Hits Data]`).setHover("show_text", hitRatioText),
        line
    )
}

let canClick = false
register("command", (c = undefined) => {
    if (!c || c !== "confirm") {
        canClick = true
        new Message(
            `${CLIENT_PREFIX}${Colour.DARK_AQUA}You are about to clear your osu! beatmaps cache.\n`,
            new TextComponent(`${Colour.AQUA}Click Here `).setHover("show_text", "Click to confirm").setClick("run_command", "/clearosucache confirm"),
            `${Colour.DARK_AQUA}to confirm.`
        ).chat()
    }
    else {
        if (!canClick) return

        canClick = false
        data.osu_cache.beatmaps = {}
        data.save()
        clientChat("Cleared!")
    }
}).setName("clearosucache")

// 2231816t
