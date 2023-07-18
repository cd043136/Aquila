export const guiMoveHelper = (x, y, showtext = true, scale = 1) => {
    Renderer.drawLine(Renderer.WHITE, x, 1, x, Renderer.screen.getHeight(), 0.5)
    Renderer.drawLine(Renderer.WHITE, Renderer.screen.getWidth(), y, 1, y, 0.5)
    Renderer.drawString(`x: ${x} y: ${y}`, x + 2, y - 10)

    if (showtext) {
        Renderer.scale(scale, scale)
        Renderer.drawString("§aSample§r\n§cText§r\n§bHere", x / scale + 2, y / scale + 2)
        Renderer.scale(1, 1)
    }
}

export function drawLine(x1, y1, z1, x2, y2, z2, red, green, blue, alpha, lineWidth = 1) {
    GL11.glBlendFunc(770, 771)
    GL11.glEnable(GL11.GL_BLEND)
    GL11.glLineWidth(lineWidth)
    GL11.glDisable(GL11.GL_TEXTURE_2D)
    GL11.glDisable(GL11.GL_DEPTH_TEST)
    GL11.glDepthMask(false)
    GlStateManager.func_179094_E()

    Tessellator.begin(GL11.GL_LINE_STRIP).colorize(red, green, blue, alpha)
    Tessellator.pos(x1, y1, z1).tex(0, 0)
    Tessellator.pos(x2, y2, z2).tex(0, 0)
    Tessellator.draw()

    GlStateManager.func_179121_F()
    GL11.glEnable(GL11.GL_TEXTURE_2D)
    GL11.glEnable(GL11.GL_DEPTH_TEST)
    GL11.glDepthMask(true)
    GL11.glDisable(GL11.GL_BLEND)
}