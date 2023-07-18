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
    }

    logoMoveGui = new Gui()

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
}

export default new settings
