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
    }

    logoMoveGui = new Gui()

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
}

export default new settings
