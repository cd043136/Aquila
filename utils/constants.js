// Texture
export const ODONATA_TEXTURE = "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOWZkODA2ZGVmZGZkZjU5YjFmMjYwOWM4ZWUzNjQ2NjZkZTY2MTI3YTYyMzQxNWI1NDMwYzkzNThjNjAxZWY3YyJ9fX0="

// Prefix
export const CLIENT_PREFIX = "§1[§9AQN§1]§r "

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
    OBFUSCATED: "§k",
}

export const Format = {
    UNDERLINE: "§u",
    ITALIC: "§o",
    BOLD: "§l",
    STRIKETHROUGH: "§m",
    RESET: "§r",
}
