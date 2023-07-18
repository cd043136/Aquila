import settings from "../../settings"
import Party from "../../utils/party"
import { clientChat, clientWarning, getPlayerData, getUUID } from "../../utils/utils"
import { Colour, Format } from "../../utils/constants"
import { registerWhen } from "../../utils/triggers"

// TODO: Highest wave, gear check, compact

registerWhen(register("chat", (player, level) => {
    if (player == Player.getName()) {
        // ks on all party members
        Object.keys(Party.members).filter(a => a !== Player.getName()).forEach(a => ChatLib.command(`ks ${a}`, true))
        return
    }
    getStats(player)
}).setCriteria("Party Finder > ${player} joined the group! (Combat Level ${level})"), () => settings.showKuudraCompletions)

register("command", (name) => {
    name = name === undefined ? Player.getName() : name
    if (name == "p") {
        // ks on all party members
        Object.keys(Party.members).filter(a => a !== Player.getName()).forEach(a => ChatLib.command(`ks ${a}`, true))
        return
    }
    getStats(name)
}).setName("kuudrastats").setAliases("ks")


const getStats = (player) => {
    clientChat(`Finding stats for ${player}...`)
    let uuid = null
    let tiers
    let basic, hot, burning, fiery, infernal
    let datastr

    getUUID(player)
        .then(res => {
            uuid = res.data.id
            player = res.data.name
            datastr = ChatLib.getCenteredText(`${Colour.YELLOW}${Format.BOLD}Kuudra completions for ${Colour.GOLD}${player}${Colour.YELLOW}:${Format.RESET}\n`)

            getPlayerData(uuid)
                .then(res => {
                    json = res.data
                    if (json.profiles === undefined) {
                        clientWarning("No SkyBlock profiles found for " + player)
                        return
                    }

                    json.profiles.forEach(profile => {
                        if (profile.selected) {
                            // correct profile
                            tiers = profile.members[uuid].nether_island_player_data?.kuudra_completed_tiers

                            basic = tiers?.none === undefined ? `${Colour.RED}0${Format.RESET}` : `${Colour.GREEN}${tiers.none}${Format.RESET}`
                            hot = tiers?.hot === undefined ? `${Colour.RED}0${Format.RESET}` : `${Colour.GREEN}${tiers.hot}${Format.RESET}`
                            burning = tiers?.burning === undefined ? `${Colour.RED}0${Format.RESET}` : `${Colour.GREEN}${tiers.burning}${Format.RESET}`
                            fiery = tiers?.fiery === undefined ? `${Colour.RED}0${Format.RESET}` : `${Colour.GREEN}${tiers.fiery}${Format.RESET}`
                            infernal = tiers?.infernal === undefined ? `${Colour.RED}0${Format.RESET}` : `${Colour.GREEN}${tiers.infernal}${Format.RESET}`

                            datastr += ChatLib.getCenteredText(`${Format.BOLD}Basic: ${Format.RESET}${basic}\n`)
                            datastr += ChatLib.getCenteredText(`${Format.BOLD}Hot: ${Format.RESET}${hot}\n`)
                            datastr += ChatLib.getCenteredText(`${Format.BOLD}Burning: ${Format.RESET}${burning}\n`)
                            datastr += ChatLib.getCenteredText(`${Format.BOLD}Fiery: ${Format.RESET}${fiery}\n`)
                            datastr += ChatLib.getCenteredText(`${Format.BOLD}Infernal: ${Format.RESET}${infernal}\n`)

                            ChatLib.chat(datastr)
                        }
                    })

                })
        })

        .catch(err => {
            clientChat("No such player")
        })
}

