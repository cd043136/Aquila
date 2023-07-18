import settings from "../../settings"
import { registerWhen } from "../../utils/triggers"
import { ArmorStand, EntityGiantZombie, MagmaCube, Blaze, Ghast, Skeleton } from "../../utils/constants"
import { data } from "../../data/pog"

registerWhen(register("renderEntity", (entity, pos, pt, event) => {
    if (entity.getClassName() == "EntityOtherPlayerMP" && !settings.cullPlayers) return

    if (data.location == "Kuudra") {
        // don't cull crates
        if (entity.getEntity() instanceof EntityGiantZombie) return

        // don't cull kuudra
        if (entity.getEntity() instanceof MagmaCube) {
            if (entity.getHeight() > 5.5) return
        }

        // don't cull wandering blazes
        if (entity.getEntity() instanceof Blaze) return

        //don't cull sentries
        if (entity.getEntity() instanceof Skeleton) return

        // don't cull dropships
        if (entity.getEntity() instanceof Ghast) return

        // don't cull supply chest drop locations & some other armorstands
        if (entity.getEntity() instanceof ArmorStand) {
            const name = entity.getName()
            if (name.includes("Elle") || name.includes("Perk Shop")) return
            if (name.includes("BRING SUPPLY CHEST") || name.includes("SUPPLIES RECEIVED") || name.includes("CANNON") || name.includes("MOUNT")) return
            if (name.includes("Collect supply chest") || name.includes("lava and bring them") || name.includes("center!") || name.includes("Collected:")) return
        }
    }

    if (Player.asPlayerMP().distanceTo(entity) > settings.cullingDistance) cancel(event)
}), () => settings.aggroCulling && settings.cullEntities && data.location != "Catacombs")

registerWhen(register("renderTileEntity", (entity, pos, pt, event) => {
    try {
        entity = entity.getBlock().pos
        if (Player.asPlayerMP().distanceTo(entity) > settings.cullingDistance) cancel(event)
    } catch (e) {
        // AMOGUS
    }
}), () => settings.aggroCulling && settings.cullTileEntities && data.location != "Catacombs")

// why does this crash :skull:
/*
registerWhen(register("spawnParticle", (p, t, event) => {
    if (p.distanceTo(Player.asPlayerMP()) > settings.cullingDistance) cancel(event)
}), () => settings.aggroCulling && settings.cullParticles && data.location != "Catacombs")*/
