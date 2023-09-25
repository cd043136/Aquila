import settings from "../../settings"
import { rs } from "./recent"
import { profile } from "./profile"
import { clientChat } from "../../utils/utils"

register("messageSent", (msg, event) => {
    if (!settings.enableOsuCommands || !msg.startsWith(">")) return

    let args = msg.split(" ").filter(x => x !== "")
    args[0] = args[0].toLowerCase()

    if (args[0] === ">rs" || args[0] === ">r" || args[0] === ">recent") {
        if (settings.hideCommandMessages) cancel(event)
        if (args.length > 1) {
            // name can contain spaces
            const username = args.slice(1).join(" ")
            rs(username)

        } else {
            return clientChat(`Specify a username. ${args[0]} <username>`)
        }
    }

    else if (args[0] === ">osu" || args[0] === ">profile") {
        if (settings.hideCommandMessages) cancel(event)
        if (args.length > 1) {
            const username = args.slice(1).join(" ")
            profile(username)

        } else {
            return clientChat(`Specify a username. ${args[0]} <username>`)
        }

    }
})