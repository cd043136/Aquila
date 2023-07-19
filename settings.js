import {
    Color,
    @ColorProperty,
    @Vigilant,
    @SwitchProperty,
    @ButtonProperty,
    @SliderProperty,
    @SelectorProperty,
    @TextProperty
} from '../Vigilance'

import { Colour, Format } from "./utils/constants"

@Vigilant("Aquila", "Aquila", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["General", "Dungeons", "Rift", "Kuudra", "Slayer", "QOL", "Debug"]
        return categories.indexOf(a.name) - categories.indexOf(b.name)
    }
})

class settings {
    constructor() {
        this.initialize(this)

        this.addDependency("Sound Distance", "Debug Sounds")
        this.addDependency("Include Sounds", "Debug Sounds")
        this.addDependency("Exclude Sounds", "Debug Sounds")

        this.addDependency("Culling Distance", "Aggressive Culling")
        this.addDependency("Cull Entities", "Aggressive Culling")
        this.addDependency("Include Players", "Aggressive Culling")
        this.addDependency("Cull Tile Entities", "Aggressive Culling")
        this.addDependency("Cull Particles", "Aggressive Culling")
    }

    logoMoveGui = new Gui()
    tokenGui = new Gui()
    hitphaseGui = new Gui()

    // DEBUG
    @SwitchProperty({
        name: "Debug Sounds",
        description: "Prints a message in chat when a sound event is played",
        category: "Debug",
        subcategory: "Sounds"
    })
    debugSounds = false;

    @SliderProperty({
        name: "Sound Distance",
        description: "Filter out sounds that are too far away",
        category: "Debug",
        subcategory: "Sounds",
        min: 1,
        max: 20
    })
    soundDistance = 10;

    @TextProperty({
        name: "Include Sounds",
        description: "If not blank, only sounds containing keywords separated by commas will be printed",
        category: "Debug",
        subcategory: "Sounds"
    })
    includeSounds = "";

    @TextProperty({
        name: "Exclude Sounds",
        description: "If not blank, sounds containing keywords separated by commas will be ignored",
        category: "Debug",
        subcategory: "Sounds"
    })
    excludeSounds = "";

    // GENERAL
    @SwitchProperty({
        name: "Display Logo",
        description: "Displays the AQN logo. lol",
        category: "General",
        subcategory: "Logo"
    })
    displayLogo = false;

    @ButtonProperty({
        name: "Move Logo",
        description: "Move logo position",
        category: "General",
        subcategory: "Logo"
    })
    moveLogo() {
        this.logoMoveGui.open()
    };

    // DUNGEONS
    @SwitchProperty({
        name: "Box Star Mobs",
        description: "Draws a box around starred mobs",
        category: "Dungeons",
        subcategory: "Star Mobs"
    })
    boxStarMobs = false;

    @ColorProperty({
        name: "Star Mobs Colour",
        description: "Star mobs box colour",
        category: "Dungeons",
        subcategory: "Star Mobs"
    })
    starMobsColor = new Color(1, 0, 0, 1);

    // KUUDRA
    @SwitchProperty({
        name: "Token Shop Helper",
        description: "Some Kuudra token shop QOL",
        category: "Kuudra",
    })
    tokenShopHelper = false;

    @ButtonProperty({
        name: "Move Token Text",
        description: "Move token text position",
        category: "Kuudra",
    })
    moveTokenText() {
        this.tokenGui.open()
    };

    @SwitchProperty({
        name: "Show Kuudra Completions",
        description: "Shows player kuudra completions upon joining the party",
        category: "Kuudra",
        subcategory: "Party Finder"
    })
    showKuudraCompletions = false;

    @SwitchProperty({
        name: "Compact Kuudra Stats",
        description: "Compacts kuudra stats into one line",
        category: "Kuudra",
        subcategory: "Party Finder"
    })
    compactKuudraStats = false;

    // QOL
    @SwitchProperty({
        name: "Coordinates",
        description: "Display coordinates on screen",
        category: "QOL"
    })
    displayCoords = false;

    @SwitchProperty({
        name: "No Death Animation",
        description: "Disables entity death animation",
        category: "QOL"
    })
    noDeathAnimation = false;

    @SwitchProperty({
        name: "Aggressive Culling",
        description: "Stops rendering a lot of stuff when they are too far away. Improves performance",
        category: "QOL",
        subcategory: "FPS"
    })
    aggroCulling = false;

    @SliderProperty({
        name: "Culling Distance",
        description: "Distance at which entities will be culled",
        category: "QOL",
        subcategory: "FPS",
        min: 5,
        max: 60
    })
    cullingDistance = 30;

    @SwitchProperty({
        name: "Cull Entities",
        description: "Some Kuudra mobs will not be culled, like crates",
        category: "QOL",
        subcategory: "FPS"
    })
    cullEntities = false;

    @SwitchProperty({
        name: "Include Players",
        description: "Include players as part of entity culling",
        category: "QOL",
        subcategory: "FPS"
    })
    cullPlayers = false;

    @SwitchProperty({
        name: "Cull Tile Entities",
        description: "Currently this culls all tile entities regardless of distance for some reason",
        category: "QOL",
        subcategory: "FPS"
    })
    cullTileEntities = false;

    @SwitchProperty({
        name: "Cull Particles",
        description: "Does nothing right now as it keeps causing crashes",
        category: "QOL",
        subcategory: "FPS"
    })
    cullParticles = false;

    // RIFT
    @SwitchProperty({
        name: "Berberis Helper",
        description: "Draws a box around harvestable berberis bush",
        category: "Rift",
        subcategory: "Dreadfarm"
    })
    berberisHelper = false;

    @SwitchProperty({
        name: "Reduce Berberis Particles",
        description: "Reduces the amount of particles from berberis bushes",
        category: "Rift",
        subcategory: "Dreadfarm"
    })
    reduceBerberisParticles = false;

    @SwitchProperty({
        name: "Odonata Helper",
        description: "Draws a box around Odonata",
        category: "Rift",
        subcategory: "Wyld Woods"
    })
    odonataHelper = false;

    @ColorProperty({
        name: "Odonata Helper Colour",
        description: "Odonata box colour",
        category: "Rift",
        subcategory: "Wyld Woods"
    })
    odonataColor = new Color(1, 0, 0, 1);

    @SwitchProperty({
        name: "Suppress Travel Sound",
        description: "Mutes the portal sound that plays when travelling to a new location",
        category: "Rift",
        subcategory: "General"
    })
    suppressTravelSound = false;

    // SLAYER
    @SwitchProperty({
        name: "Warp Shortcut",
        description: `Enables short commands to warp to slayer locations:\n
    ${Colour.GREEN}/ws:${Format.RESET} warp sepulture\n
    ${Colour.GREEN}/wc:${Format.RESET} warp crypt\n
    ${Colour.GREEN}/wa:${Format.RESET} warp arachne\n
    ${Colour.GREEN}/wh:${Format.RESET} warp howl\n
    ${Colour.GREEN}/ww:${Format.RESET} warp wiz\n
    ${Colour.GREEN}/wsm:${Format.RESET} warp smold\n
${Colour.RED}${Format.BOLD}WARNING:${Format.RESET} This will *likely* override any mod commands of the same name.`,
        category: "Slayer",
        subcategory: "QOL"
    })
    warpShortcut = false;

    @SwitchProperty({
        name: "Point to Boss",
        description: "Draws an arrow pointing to the boss, useful for low fov / high ping eman slaying",
        category: "Slayer",
        subcategory: "Visuals"
    })
    pointToBoss = false;

    @SwitchProperty({
        name: "Suppress Eman TP",
        description: "Stops the boss from teleporting (visual)",
        category: "Slayer",
        subcategory: "Visuals"
    })
    suppressEmanTp = false;

    @SwitchProperty({
        name: "Highlight Minibosses",
        description: "Highlights minibosses in slayer quests",
        category: "Slayer",
        subcategory: "Visuals"
    })
    highlightMinibosses = false;

    @SelectorProperty({
        name: "Fill Type",
        description: "How minibosses should be highlighted",
        category: "Slayer",
        subcategory: "Visuals",
        options: ["Fill", "Box"]
    })
    fillType = 0;

    @SwitchProperty({
        name: "Boss Alert",
        description: "Alerts you when your boss spawned",
        category: "Slayer",
        subcategory: "QOL"
    })
    bossAlert = false;

    @SwitchProperty({
        name: "Miniboss Ping",
        description: "Plays a sound when a miniboss spawns, same feature as soopy's but less reliable XD",
        category: "Slayer",
        subcategory: "QOL"
    })
    minibossPing = false;

    @SwitchProperty({
        name: "Phase Display",
        description: `
Displays text showing voidgloom hits remaining, beacon, and laser timers.
${Format.ITALIC}${Colour.RED}If the wrong boss is highlighted, punch the correct boss to fix it.`,
        category: "Slayer",
        subcategory: "Voidgloom"
    })
    phaseDisplay = false;

    @ButtonProperty({
        name: "Move Phase Text",
        description: "Move hit phase text position",
        category: "Slayer",
        subcategory: "Voidgloom"
    })
    moveHitPhaseText() {
        this.hitphaseGui.open()
    };

    @SwitchProperty({
        name: "Beacon Helper",
        description: "Draws a path to the beacon as it flies",
        category: "Slayer",
        subcategory: "Voidgloom"
    })
    beaconHelper = false;
}

export default new settings
