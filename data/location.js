import { removeUnicode, getMatchFromLines, getScoreboard, clientChat, getTabList } from "../utils/utils"
import { data } from "./pog"

const getLocation = () => {
    const title = Scoreboard.getTitle()
    if (!title.length || !title.removeFormatting().includes("SKYBLOCK")) return "none"

    const l = removeUnicode(getMatchFromLines(/ [ф|⏣] (.+)/, getScoreboard(false))).replace(/ \(.+\)/, "")
    if (l.includes("Kuudra's Hol")) return "Kuudra"
    if (l.includes("The Catacombs")) return "Catacombs"
    return l
}

const getArea = () => {
    const a = getMatchFromLines(/Area: (.+)/, getTabList(false), "str")
    return a === null ? "none" : a
}

register("tick", () => {
    data.location = getLocation() == "" ? "none" : getLocation()
    data.area = getArea()
    data.save()
})

/*
register("command", (...testloc) => {
    clientChat("Location: " + data.location)
    clientChat(data.location == testloc)
}).setName("gloc")
*/
