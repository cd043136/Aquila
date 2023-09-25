import { getProfile, formatProfile } from "../../utils/osu"

export const profile = (username) => {
    if (username === undefined) return clientChat("Specify a username. >osu <username>")

    getProfile(username)
        .then(profile => {
            formatProfile(profile).chat()
        })
        .catch(err => {
            clientChat(`Error fetching profile: ${err}`)
        })
}
