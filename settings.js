import { data } from "./data/pog"
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
        const categories = ["General", "QOL", "Dungeons", "Rift", "Kuudra", "Slayer", "osu!", "Debug"]
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

        this.addDependency("Hide Type", "Spam Hider")
        this.addDependency("Hide Death Messages", "Spam Hider")
        this.addDependency("Hide Boss Messages", "Spam Hider")
        this.addDependency("Hide Mort Messages", "Spam Hider")

        this.addDependency("Hide From ActionBar", "Dominus Timer")

        this.addDependency("Move Overlay", "Progress Overlay")
        this.addDependency("Show Everywhere", "Progress Overlay")

        //
        this.setCategoryDescription("osu!",
            `Runs generic osu! commands.

First, set your osu! api key with ${Colour.GREEN}/osuapikey <key>${Format.RESET}

Beatmap data is cached. If it starts taking up too much space, you can clear them with ${Colour.RED}/clearosucache${Format.RESET} or with the button below.`)
    }

    logoMoveGui = new Gui()
    tokenGui = new Gui()
    hitphaseGui = new Gui()
    spamChatGui = new Gui()
    slayerOvGui = new Gui()
    dominusGui = new Gui()
    summonsGui = new Gui()

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
        min: 0,
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

    @SliderProperty({
        name: "Update Check Interval",
        description: `
Update checks are done whenever you switch worlds (e.g. from warping) if the last check was more than ${Colour.GREEN}_ minutes${Format.RESET} ago.

Setting a value of ${Colour.RED}0${Format.RESET} will always check for updates when you switch worlds.`,
        category: "General",
        subcategory: "Updates",
        min: 0,
        max: 60
    })
    updateCheckInterval = 5;

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

    @SliderProperty({
        name: "Distance Filter",
        description: "Only draw boxes around star mobs within this distance",
        category: "Dungeons",
        subcategory: "Star Mobs",
        min: 5,
        max: 60
    })
    starMobsDistance = 30;

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
        name: "Dominus Timer",
        description: `
Displays how long until you lose a dominus stack. Might be inaccurate upon reloading the mod.
${Colour.RED}Requires ${Format.BOLD}Book of Stats${Format.RESET}${Colour.RED} on damage weapon!`,
        category: "QOL",
        subcategory: "Crimson Armor"
    })
    dominusTracker = false;

    @SwitchProperty({
        name: "Hide From ActionBar",
        description: "Hides dominus text from actionbar (the usual place where it is displayed, beside the hp)",
        category: "QOL",
        subcategory: "Crimson Armor"
    })
    hideFromActionBar = false;

    @ButtonProperty({
        name: "Move Dominus Text",
        description: "Move dominus timer text position",
        category: "QOL",
        subcategory: "Crimson Armor"
    })
    moveDominusText() {
        this.dominusGui.open()
    };

    @SwitchProperty({
        name: "Spam Hider",
        description: "Hides spammy messages like Implosion dmg etc",
        category: "QOL",
        subcategory: "Spam"
    })
    spamHider = false;

    @SelectorProperty({
        name: "Hide Type",
        description: "How spammy messages should be hidden",
        category: "QOL",
        subcategory: "Spam",
        options: ["Hide completely", "Separate chat"]
    })
    hideType = 0;

    @SwitchProperty({
        name: "Hide Death Messages",
        description: "Hides player death messages",
        category: "QOL",
        subcategory: "Spam"
    })
    hideDeathMessages = false;

    @SwitchProperty({
        name: "Hide Boss Messages",
        description: "Hides dungeon boss messages",
        category: "QOL",
        subcategory: "Spam"
    })
    hideBossMessages = false;

    @SwitchProperty({
        name: "Hide Mort Messages",
        category: "QOL",
        subcategory: "Spam"
    })
    hideMortMessages = false;

    @ButtonProperty({
        name: "Move Spam Text",
        description: "Move where spam text is displayed if 'Separate chat' option is selected",
        category: "QOL",
        subcategory: "Spam"
    })
    moveSpamText() {
        this.spamChatGui.open()
    };

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
    ${Colour.GREEN}/wsp:${Format.RESET} warp spider\n
    ${Colour.GREEN}/wh:${Format.RESET} warp howl\n
    ${Colour.GREEN}/wr:${Format.RESET} warp castle (ruins)\n
    ${Colour.GREEN}/ww:${Format.RESET} warp wiz\n
    ${Colour.GREEN}/wsm:${Format.RESET} warp smold\n
${Colour.RED}${Format.BOLD}WARNING:${Format.RESET} This will *likely* override any mod commands of the same name.`,
        category: "Slayer",
        subcategory: "QOL"
    })
    warpShortcut = false;

    @SwitchProperty({
        name: "Miniboss Ping",
        description: "Plays a sound when a miniboss spawns, same feature as soopy's but less reliable XD",
        category: "Slayer",
        subcategory: "QOL"
    })
    minibossPing = false;

    @SwitchProperty({
        name: "Progress Overlay",
        description: `
Displays slayer progress on screen (remaining bosses, xp, etc). Requires you to complete one slayer quest first.
${Colour.RED}Inaccurate during Aatrox bonus slayer XP perk!${Format.RESET}`,
        category: "Slayer",
        subcategory: "Overlay"
    })
    progressOverlay = false;

    @SwitchProperty({
        name: "Show Everywhere",
        description: "Shows slayer progress overlay everywhere, not just in slayer locations",
        category: "Slayer",
        subcategory: "Overlay"
    })
    showEverywhere = false;

    @SwitchProperty({
        name: "Force Aatrox",
        description: "Force Aatrox +25% slayer xp perk to fix 'boss remaining' count",
        category: "Slayer",
        subcategory: "Overlay"
    })
    forceAatrox = false;

    @ButtonProperty({
        name: "Move Overlay",
        description: "Move slayer progress overlay position",
        category: "Slayer",
        subcategory: "Overlay"
    })
    moveOverlay() {
        this.slayerOvGui.open()
    }

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
        name: "Phase Display",
        description: "Displays text showing voidgloom HP, hits remaining, beacon, and laser timers",
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

    @SwitchProperty({
        name: "Summons HP",
        description: "Display summons HP",
        category: "Slayer",
        subcategory: "Voidgloom"
    })
    summonsHP = false;

    @ButtonProperty({
        name: "Move Summons Text",
        description: "Move summons HP text position",
        category: "Slayer",
        subcategory: "Voidgloom"
    })
    moveSummonsText() {
        this.summonsGui.open()
    };

    @SwitchProperty({
        name: "Boss Spawn Alert",
        description: "Plays a sound and show big text on screen when the boss is spawning",
        category: "Slayer",
        subcategory: "Misc"
    })
    bossSpawnAlert = false;

    // osu
    @SwitchProperty({
        name: "Enable osu! Commands",
        description: `Available commands:
${Colour.GREEN}>rs|r <username>${Format.RESET} - Displays recent score for <username>
${Colour.GREEN}>osu|profile <username>${Format.RESET} - Displays osu! profile for <username>`,
        category: "osu!"
    })
    enableOsuCommands = false;

    @SwitchProperty({
        name: "Hide command messages",
        description: "Hides your commands (>rs, >osu, etc) from chat",
        category: "osu!"
    })
    hideCommandMessages = true;

    @ButtonProperty({
        name: "Clear Beatmap Cache",
        description: "Clears cached beatmaps data",
        category: "osu!"
    })
    clearBeatmapCache() {
        data.osu_cache.beatmaps = {}
        data.save()
        clientChat("Cleared!")
    }
}

export default new settings
