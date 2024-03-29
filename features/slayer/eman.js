import settings from "../../settings"
import RenderLib from "../../../RenderLib"
import { data } from "../../data/pog"
import { getSlayer, slayerFightCheck } from "../../utils/slayer"
import { addForgeTrigger, registerWhen } from "../../utils/triggers"
import { ArmorStand, EnderTeleportEvent, Enderman, EventPriority } from "../../utils/constants"
import { drawLine, guiMoveHelper } from "../../utils/render"
import { Colour, Format } from "../../utils/constants"
import { clientChat, distance2D, removeUnicode } from "../../utils/utils"
import { registerForge } from "../../utils/forgeevents"

let spawnedByStand = undefined
let bossStand = undefined
let bossEntity = undefined

// laser timer
let inLaser = false
let laserTimer = 8

// beacon
let holdingBeacon = false
let beacontime = 0
let beaconArmorStand = undefined
let beaconPoints = []
let beaconBlock = undefined

// hp
let hp = ""

registerWhen(register("tick", () => {
    const stands = World.getAllEntitiesOfType(ArmorStand.class)

    spawnedByStand = stands.find(e => e.getName().includes(Player.getName()) && e.getName().includes("Spawned by"))
    if (spawnedByStand === undefined) {
        // still can't find boss
        bossStand = undefined
        bossEntity = undefined
        beaconArmorStand = undefined
        return
    }

    bossStand = stands.find(e => e.getName().includes(" Seraph") && e.distanceTo(spawnedByStand) < 3)
    if (bossStand === undefined) {
        hp = ""
        bossEntity = undefined
        beaconArmorStand = undefined
        return

    }
    else {
        // boss hp stuff
        if (bossStand.getName().includes("❤")) {
            // ☠ Voidgloom Seraph ᛤ 276k❤
            if (bossStand.getName().includes("ᛤ")) {
                // get the last 2 words
                // use .join and .split
                hp = bossStand.getName().split(" ").slice(-2).join(" ")
            }
            else hp = bossStand.getName().split(" ")[bossStand.getName().split(" ").length - 1]
        } else hp = ""
    }

    // attempt to find the actual enderman entity
    if (bossEntity === undefined) {
        const emans = World.getAllEntitiesOfType(Enderman.class).filter(
            e => distance2D(e.getX(), e.getZ(), bossStand.getX(), bossStand.getZ()) < 1.5 &&
                Math.abs(e.getY() - bossStand.getY()) < 4
        )

        if (emans.length === 0) {
            bossEntity = undefined
            return
        }
        else if (emans.length > 1) return // retry
        else {
            bossEntity = emans[0]
        }
    }

    else {
        // laser phase
        if (bossEntity.getEntity().func_70115_ae()) {  // isRiding
            if (!inLaser) {
                inLaser = true
                laserTimer = 8  // just in case
            }
            if (laserTimer >= 0.05) laserTimer -= 0.05
        }
        else {
            // sometimes boss can stop riding for a split second after
            // entering laser phase. this fixes that
            if (laserTimer < 5) {
                inLaser = false
                laserTimer = 8
            }
        }

        // beacon phase
        // clientChat(bossEntity.getEntity().func_175489_ck().toString() === "minecraft:beacon")
        if (bossEntity.getEntity().func_175489_ck().toString() === "minecraft:beacon") {
            if (!holdingBeacon) {
                holdingBeacon = true
                beaconArmorStand = undefined
            }
        }
        else {
            if (holdingBeacon) {
                beacontime = 5.65
                holdingBeacon = false
            }
            else {
                if (beacontime >= 0.05) beacontime -= 0.05
                holdingBeacon = false

                // attempt to find beacon holder
                if (settings.beaconHelper) {
                    if (beaconArmorStand === undefined) {
                        beaconPoints = []
                        // filter to beacon holders
                        const temp = World.getAllEntitiesOfType(ArmorStand.class)
                            .filter(e => e.getEntity().func_71124_b(4) && e.getEntity().func_71124_b(4).func_82833_r() === "Beacon" && e.distanceTo(bossEntity) < 2)
                        // fix above
                        if (temp.length === 1) beaconArmorStand = temp[0]
                    }
                    else {
                        // trace beacon position
                        if (!beaconArmorStand.isDead()) {
                            beaconPoints.push({
                                x: parseFloat(beaconArmorStand.getX().toFixed(2)),
                                y: parseFloat(beaconArmorStand.getY().toFixed(2)),
                                z: parseFloat(beaconArmorStand.getZ().toFixed(2))
                            })
                        }
                        else {
                            // already dead, find beacon
                            if (beaconPoints.length && !beaconBlock) {
                                const last = beaconPoints[beaconPoints.length - 1]
                                for (let x = -2; x <= 2; x++) {
                                    for (let y = -2; y <= 21; y++) {
                                        for (let z = -2; z <= 2; z++) {
                                            const block = World.getBlockAt(last.x + x, last.y + y, last.z + z)
                                            if (block.type.getID() === 138) beaconBlock = { x: block.getX(), y: block.getY(), z: block.getZ() }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}), () => slayerFightCheck() && getSlayer() === "Voidgloom Seraph" && (settings.phaseDisplay || settings.pointToBoss || settings.beaconHelper))

registerWhen(register("renderOverlay", () => {
    if (bossStand === undefined) return
    let overlayStr = ""

    // hp
    if (hp !== "") {
        overlayStr += `${hp}\n`
    }

    // hit phase thing
    if (bossStand.getName().includes("Hits")) {
        // ☠ Voidgloom Seraph 30 Hits
        // ☠ Voidgloom Seraph ᛤ 12 Hits
        const cleanName = ChatLib.removeFormatting(bossStand.getName())
        // get the 2nd last word
        const hits = parseInt(cleanName.split(" ")[cleanName.split(" ").length - 2])
        const c = hits > 75 ? Colour.GREEN : hits > 50 ? Colour.YELLOW : hits > 25 ? Colour.GOLD : Colour.RED
        overlayStr += `${Format.BOLD}${c}${hits}${Format.RESET}${Colour.GRAY} Hits${Format.RESET}\n`
    }

    // laser text
    if (bossEntity !== undefined && inLaser) {
        const c = laserTimer > 6 ? Colour.GREEN : laserTimer > 4 ? Colour.YELLOW : laserTimer > 2 ? Colour.GOLD : Colour.RED
        overlayStr += `${Format.BOLD}${c}${laserTimer.toFixed(1)}${Format.RESET}${Colour.GRAY}s Laser${Format.RESET}\n`
    }

    // beacon text
    if (bossEntity !== undefined && beacontime > 0) {
        const c = beacontime > 4 ? Colour.GREEN : beacontime > 2 ? Colour.YELLOW : Colour.RED
        overlayStr += `${Format.BOLD}${c}${beacontime.toFixed(1)}${Format.RESET}${Colour.GRAY}s Beacon${Format.RESET}\n`
    }

    Renderer.scale(2, 2)
    Renderer.drawString(overlayStr, data.hit_phase_location.x / 2, data.hit_phase_location.y / 2, true)
    Renderer.scale(1, 1)
}), () => slayerFightCheck() && getSlayer() === "Voidgloom Seraph" && settings.phaseDisplay)

// TODO: make point to boss a separate file
// maybe a folder for each slayer boss?
registerWhen(register("renderWorld", () => {
    if (settings.beaconHelper && beaconPoints.length > 1) {
        // render path
        // for some reason the for loop doesn't work?? so im using soopy's method
        let p1 = undefined
        beaconPoints.forEach(p2 => {
            if (p1) {
                drawLine(p1.x, p1.y + 0.7, p1.z, p2.x, p2.y + 0.7, p2.z, 0, 1, 1, 1, 4)
            }
            p1 = p2
        })

        if (beaconBlock !== undefined) RenderLib.drawInnerEspBox(
            beaconBlock.x + 0.5,
            beaconBlock.y,
            beaconBlock.z + 0.5, 1, 1, 0, 1, 1, 1, 1
        )
    }

    let leftCoords = {
        x: Player.getRenderX(),
        z: Player.getRenderZ()
    }

    let rightCoords = {
        x: Player.getRenderX(),
        z: Player.getRenderZ()
    }

    const y = Player.getRenderY()
    const yawRadians = Player.getYaw() * Math.PI / 180

    // translate coords based on yaw
    leftCoords.x -= 0.3 * Math.cos(yawRadians)
    leftCoords.z -= 0.3 * Math.sin(yawRadians)

    rightCoords.x += 0.3 * Math.cos(yawRadians)
    rightCoords.z += 0.3 * Math.sin(yawRadians)

    if (bossStand === undefined) return // sometimes bossStand becomes undefined between tick and renderWorld
    const entityCoords = normalisedEntityCoords(bossStand.getRenderX(), bossStand.getRenderZ())

    drawLine(leftCoords.x, y, leftCoords.z, entityCoords.x, y, entityCoords.z, 1, 0, 0, 1, 3)
    drawLine(rightCoords.x, y, rightCoords.z, entityCoords.x, y, entityCoords.z, 1, 0, 0, 1, 3)

    // CHANGE checkfunc if other stuff is added
}), () => slayerFightCheck() && getSlayer() === "Voidgloom Seraph" && bossStand !== undefined && (settings.pointToBoss || settings.beaconHelper))

const normalisedEntityCoords = (entityX, entityZ) => {
    /*return {
        x: Player.getRenderX() + (entityX - Player.getRenderX()) / 3,
        z: Player.getRenderZ() + (entityZ - Player.getRenderZ()) / 3
    }*/
    const dX = entityX - Player.getRenderX()
    const dZ = entityZ - Player.getRenderZ()
    const d = Math.sqrt(dX * dX + dZ * dZ)

    // returns x z coords of entity, normalised to 2 block away from player
    return {
        x: Player.getRenderX() + (dX / d) * 2,
        z: Player.getRenderZ() + (dZ / d) * 2
    }
}

register("soundPlay", (pos, name, vol, pitch, cat, event) => {
    if (!slayerFightCheck() || beacontime === 0) return
    if (name === "random.break" && vol === 1 && parseFloat(pitch.toFixed(3)) == 0.492) {
        // clientChat("BEACON BROKEN!")
        beacontime = 0
        beaconArmorStand = undefined
        // beaconPoints.forEach(p => console.log(`{x: ${p.x}, y: ${p.y}, z: ${p.z}},`))
        beaconPoints = []
        beaconBlock = undefined
    }
})

//
// GUI
//

registerWhen(register("renderOverlay", () => {
    guiMoveHelper(data.hit_phase_location.x, data.hit_phase_location.y, true, 2)
}), () => settings.hitphaseGui.isOpen())

register("dragged", (dx, dy, x, y, btn) => {
    if (settings.hitphaseGui.isOpen()) {
        data.hit_phase_location.x = parseInt(x)
        data.hit_phase_location.y = parseInt(y)
        data.save()
    }
})

register("chat", () => {
    setTimeout(() => {
        spawnedByStand = undefined
        bossStand = undefined
        bossEntity = undefined
        inLaser = false
        laserTimer = 8
        beaconPoints = []
        beaconArmorStand = undefined
        holdingBeacon = false
        beacontime = 0
        beaconBlock = undefined
    }, 500)
}).setCriteria(/^(  SLAYER QUEST (FAILED|STARTED)!)|(Your Slayer Quest has been cancelled!)$/)

// suppress TP

addForgeTrigger(registerForge(EnderTeleportEvent, EventPriority.HIGH, (e) => {
    if (settings.suppressEmanTp && slayerFightCheck()) cancel(e)
}))
