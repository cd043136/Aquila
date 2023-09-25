import settings from "../../settings"
import RenderLib from "../../../RenderLib"
import { data } from "../../data/pog"
import { registerWhen } from "../../utils/triggers"
import { Creeper } from "../../utils/constants"
import { drawLine } from "../../utils/render"

let ghostQueue = []

registerWhen(register("tick", () => {
    // remove dead creepers from queue
    ghostQueue.map(c => {
        if (c.isDead() || c.getY() > 77) ghostQueue.splice(ghostQueue.indexOf(c), 1)
    })

    const creepers = World.getAllEntitiesOfType(Creeper).filter(e =>
        e.isInvisible() &&
        e.getY() == 76 &&
        e.getX() > 118 &&
        !ghostQueue.find(c => c.getUUID().toString() === e.getUUID().toString())
    )
    if (!creepers.length) return

    switch (ghostQueue.length) {
        case 0:
            const closestCreeper = creepers.sort((a, b) => a.distanceTo(Player.asPlayerMP()) - b.distanceTo(Player.asPlayerMP()))[0]  // sort by distance
            ghostQueue.push(closestCreeper)
            break

        case 1:
            const optimal1 = getOptimalCreeper(Player.asPlayerMP(), ghostQueue[0], creepers)
            ghostQueue.push(optimal1)
            break

        case 2:
            const optimal2 = getOptimalCreeper(ghostQueue[0], ghostQueue[1], creepers)
            ghostQueue.push(optimal2)
            break

        case 3:
            const optimal3 = getOptimalCreeper(ghostQueue[1], ghostQueue[2], creepers)
            ghostQueue.push(optimal3)
            break

        default:
            break
    }

    // get closest creeper

}), () => settings.ghostPath && data.area === "Dwarven Mines" && Player.getY() < 91)

registerWhen(register("renderWorld", () => {
    const ghostCopy = [...ghostQueue]  // just in case ghostQueue is modified while rendering
    const gh = ghostCopy[0]
    RenderLib.drawInnerEspBox(gh.getRenderX(), gh.getRenderY(), gh.getRenderZ(), 1, gh.getHeight(), 1, 0, 0, 0.3, 1)

    // draw lines
    for (let i = 0; i < ghostCopy.length - 1; i++) {
        if (i === 2) break
        let from = ghostCopy[i]
        let to = ghostCopy[i + 1]

        drawLine(
            from.getRenderX(),
            from.getRenderY() + from.getHeight() / 3,
            from.getRenderZ(),
            to.getRenderX(),
            to.getRenderY() + to.getHeight() / 3,
            to.getRenderZ(),
            1, 0, 0, 1 - (i * 0.75), 3
        )
    }
}), () => settings.ghostPath && data.area === "Dwarven Mines" && Player.getY() < 91 && ghostQueue.length)

const getOptimalCreeper = (prev, current, creepers) => {
    let temp = []
    let elb = new EntityLivingBase(current.getEntity())
    // ignore creepers that cant be seen by current
    let visibleFiltered = creepers.filter(c => elb.canSeeEntity(c))
    temp = visibleFiltered.length ? visibleFiltered : creepers

    // two lines: prev -> current, current -> optimal
    // to find optimal, find the smaller angle between the two lines
    // if the angle is too small, ignore the creeper
    let line1 = {
        from: {
            x: prev.getX(),
            z: prev.getZ()
        },
        to: {
            x: current.getX(),
            z: current.getZ()
        }
    }

    let angleFiltered = temp.filter(c => {
        let line2 = {
            from: {
                x: current.getX(),
                z: current.getZ()
            },
            to: {
                x: c.getX(),
                z: c.getZ()
            }
        }
        return getAngle(line1, line2) > settings.ghostPathMinAngle
    })
    temp = angleFiltered.length ? angleFiltered : creepers

    // ignore creepers that are too close to current
    let distanceFiltered = temp.filter(c => c.distanceTo(current) > settings.ghostPathMinDistance)
    temp = distanceFiltered.length ? distanceFiltered : temp

    // return closest creeper from temp
    return temp.sort((a, b) => a.distanceTo(current) - b.distanceTo(current))[0]  // sort by distance
}

const getAngle = (line1, line2) => {
    let angle1 = Math.atan2(line1.from.z - line1.to.z, line1.from.x - line1.to.x)
    let angle2 = Math.atan2(line2.from.z - line2.to.z, line2.from.x - line2.to.x)
    let angle = Math.abs(angle1 - angle2) * 180 / Math.PI
    return angle > 180 ? 360 - angle : angle
}
