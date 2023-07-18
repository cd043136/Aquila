const triggers = []
export const registerWhen = (t, checkFunc) => triggers.push(
    {
        trigger: t.unregister(),
        check: checkFunc,
        registered: false
    }
)
register("tick", () => {
    for (let i = 0; i < triggers.length; i++) {
        let t = triggers[i].trigger
        let func = triggers[i].check
        let tReg = triggers[i].registered

        if (func()) {
            if (!tReg) {
                t.register()
                triggers[i].registered = true
            }
        }
        else {
            if (tReg) {
                t.unregister()
                triggers[i].registered = false
            }
        }
    }
})
