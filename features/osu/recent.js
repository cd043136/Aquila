import settings from "../../settings"
import { formatRecentScore, getBeatmap, getRecentScore } from "../../utils/osu"
import { clientChat } from "../../utils/utils"

const rs = (username) => {
    if (username === undefined) return clientChat("Specify a username. /recent <username>")
    let beatmap_id

    getRecentScore(username)
        .then(score => {
            beatmap_id = score.beatmap_id

            getBeatmap(beatmap_id)
                .then(beatmap => {
                    formatRecentScore(username, score, beatmap).chat()
                })
                .catch(err => {
                    clientChat(`Error: ${err}`)
                })
        })
        .catch(err => {
            clientChat(`${err}`)
        })
}

register("messageSent", (msg, event) => {
    if (!settings.enableOsuCommands) return

    const args = msg.split(" ")
    if (args[0] === ">rs" || args[0] === ">r") {
        if (settings.hideCommandMessages) cancel(event)

        if (args.length > 1) {
            // name can contain spaces
            const username = args.slice(1).join(" ")
            rs(username)
            return

        } else {
            return clientChat("Specify a username. >rs <username>")
        }
    }

    else if (args[0] === ">osu") {
        // todo
    }

    else if (args[0].startsWith(">")) {
        // matches no other commands
        clientChat(`Unknown command: ${args[0]}`)
        cancel(event)
    }
})
