// Texture
export const ODONATA_TEXTURE = "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWZkODA2ZGVmZGZkZjU5YjFmMjYwOWM4ZWUzNjQ2NjZkZTY2MTI3YTYyMzQxNWI1NDMwYzkzNThjNjAxZWY3YyJ9fX0="

// Roman numerals
export const RomanNumerals = {
    "I": 1,
    "V": 5,
    "X": 10,
    "L": 50,
    "C": 100
}

// Slayer stuff
export const SlayerXP = {
    1: 5,
    2: 25,
    3: 100,
    4: 500,
    5: 1500
}

export const slayerNames = [
    "Voidgloom Seraph",
    "Revenant Horror",
    "Sven Packmaster",
    "Tarantula Broodfather",
    "Riftstalker Bloodfiend",
    "Inferno Demonlord"
]

// Prefix
export const CLIENT_PREFIX = "§1[§9AQ§1]§r "

// Entities
export const ArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand")
export const EntityGiantZombie = Java.type("net.minecraft.entity.monster.EntityGiantZombie")
export const MagmaCube = Java.type("net.minecraft.entity.monster.EntityMagmaCube")
export const Blaze = Java.type("net.minecraft.entity.monster.EntityBlaze")
export const Ghast = Java.type("net.minecraft.entity.monster.EntityGhast")
export const Skeleton = Java.type("net.minecraft.entity.monster.EntitySkeleton")
export const Enderman = Java.type("net.minecraft.entity.monster.EntityEnderman")

export const Beacon = Java.type("net.minecraft.tileentity.TileEntityBeacon")

// Forge events
export const EventPriority = {
    LOWEST: "LOWEST",
    LOW: "LOW",
    NORMAL: "NORMAL",
    HIGH: "HIGH",
    HIGHEST: "HIGHEST"
}
export const EnderTeleportEvent = Java.type("net.minecraftforge.event.entity.living.EnderTeleportEvent")
export const EntityJoinWorldEvent = Java.type("net.minecraftforge.event.entity.EntityJoinWorldEvent")

// Kuudra class upgrade costs
export const KDR_UPGR_COST = {
    cannoneer: {
        "accelerated_shot": [50, 100, 150, 200, 250, 300, 350],
        "blast_radius": [80, 160, 240, 320, 400, 480, 560],
        "cannon proficiency": [160, 240, 340, 420, 520, 600, 680],
        "multi-shot": [180, 270, 380, 470, 580],
        "rapid fire": [50, 100, 150, 200, 250],
        "steady aim": [80, 160, 240, 320, 400, 480, 560]
    },
    cc: {
        "sweeping edge": [80, 160, 240, 320, 400, 480],
        "freezing touch": [50, 100, 150, 200, 250],
        "miniature nuke": [500],
        "bonus damage": [160, 240, 340, 420, 520, 600],
        "antibiotic": [80, 160, 240, 320, 400],
        "blight slayer": [160, 240, 340, 420, 520],
    },
    specialist: {
        "steady hands": [50, 100, 150, 200, 250, 300, 350],
        "ballista mechanic": [80, 160, 240, 320, 400],
        "bomberman": [80, 160, 240, 320, 400],
        "mining frenzy": [80, 160, 240, 320, 400, 480, 560],
    },
    support: {
        "healing aura": [50, 100, 150, 200, 250, 300],
        "mana aura": [80, 160, 240, 320, 400, 480, 560],
        "protective aura": [80, 160, 240, 320, 400, 480],
        "faster respawn": [80, 160, 240, 320, 400],
        "revive final killed": [750],
        "revive dead": [500]
    }
}

export const KDR_SLOTS = [12, 13, 14, 21, 22, 23]

// Colour codes
export const Colour = {
    BLACK: "§0",
    DARK_BLUE: "§1",
    DARK_GREEN: "§2",
    DARK_AQUA: "§3",
    DARK_RED: "§4",
    DARK_PURPLE: "§5",
    GOLD: "§6",
    GRAY: "§7",
    DARK_GRAY: "§8",
    BLUE: "§9",
    GREEN: "§a",
    AQUA: "§b",
    RED: "§c",
    LIGHT_PURPLE: "§d",
    YELLOW: "§e",
    WHITE: "§f",
}

export const Format = {
    UNDERLINE: "§u",
    ITALIC: "§o",
    BOLD: "§l",
    STRIKETHROUGH: "§m",
    RESET: "§r",
    OBFUSCATED: "§k"
}

export const spamRegex = [
    /There are blocks in the way!/,
    /Your (.+) hit (.+) enem(y|(ies)) for (.+) damage\./,
    /You are playing on profile: (.+)/,
    /Profile ID: (.+)/,
    /Not enough mana! (Costs (.+) mana)/,
    /\+(.+) Kill Combo (.+)/,
    /Sending to server (.+)\.\.\./,
    /You earned (.+) from playing SkyBlock!/,
    /Your Kill Combo has expired! You reached a (.+) Kill Combo!/,
    /Warping\.\.\./,
    /You summoned your (.+)!/,
    /Unknown command\. Type "\/help" for help\./,
    /This ability is on cooldown for (.+)/,
    /Your active Potion Effects have been paused and stored\. They will be restored when you leave Dungeons\! You are not allowed to use existing Potion Effects while in Dungeons\./,
    /Your previous (.+) was removed\!/,
    /(.+) is ready to use\! Press (.+) to activate it\!/,
    /(.+) is now ready\!/,
    /(.+) selected the (.+) Dungeon Class\!/,
    /Dungeon starts in (.+) seconds\./,
    /Creeper Veil (A|De\-a)ctivated\!/
]

export const mortMsgRegex = [
    /\[NPC\] Mort\: Here\, I found this map when I first entered the dungeon\./,
    /\[NPC\] Mort\: You should find it useful if you get lost\./,
    /\[NPC\] Mort\: Good luck\./
]

// maybe add more specific regexes for each boss
export const bossMsgRegex = [/[BOSS] (.+)\: (.+)/]

export const deathMsgRegex = [/ ☠ (.+) was killed by (.+)\./]