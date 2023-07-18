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
    constructor() { }
}

export default new settings
