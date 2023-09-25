import { formatRecentScore, getBeatmap, getRecentScore } from "../../utils/osu"
import { clientChat } from "../../utils/utils"

export const rs = (username) => {
    if (username === undefined) return clientChat("Specify a username. >rs <username>")
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
