import settings from "../../settings"

const doWarp = (cmd, e) => {
    cancel(e)
    ChatLib.command(cmd)
}

register("messageSent", (msg, event) => {
    if (!settings.warpShortcut) return
    msg = msg.toLowerCase()

    if (msg == "/ws") doWarp("warp sepulture", event)
    else if (msg == "/wc") doWarp("warp crypt", event)
    else if (msg == "/wa") doWarp("warp arachne", event)
    else if (msg == "/wh") doWarp("warp howl", event)
    else if (msg == "/ww") doWarp("warp wiz", event)
    else if (msg == "/wsm") doWarp("warp smold", event)
})