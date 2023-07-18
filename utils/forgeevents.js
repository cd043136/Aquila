// from https://www.chattriggers.com/modules/v/ForgeEvents

const MinecraftForge = Java.type("net.minecraftforge.common.MinecraftForge");

const EventBus = Java.type(
    "net.minecraftforge.fml.common.eventhandler.EventBus"
);
const SubscribeEvent = Java.type(
    "net.minecraftforge.fml.common.eventhandler.SubscribeEvent"
);

const ClassWriter = Java.type("org.objectweb.asm.ClassWriter");
const Type = Java.type("org.objectweb.asm.Type");
const Opcodes = Java.type("org.objectweb.asm.Opcodes");

const ClassLoader = Java.type("java.lang.ClassLoader");
const RandomStringUtils = Java.type(
    "org.apache.commons.lang3.RandomStringUtils"
);
const Consumer = Java.type("java.util.function.Consumer");
const EventPriority = Java.type(
    "net.minecraftforge.fml.common.eventhandler.EventPriority"
);

const L = (s) => `L${s};`;

const LoadedInsts = [];

const classLoader = com.chattriggers.ctjs.CTJS.class.getClassLoader();

const defClass = ClassLoader.class.getDeclaredMethods().find((m) => {
    return (
        m.toString() ===
        "protected final java.lang.Class java.lang.ClassLoader.defineClass(java.lang.String,byte[],int,int) throws java.lang.ClassFormatError"
    );
});

defClass.setAccessible(true);

function defineClassBytes(name, bytes) {
    const n = new java.lang.String(name);
    const o = new java.lang.Integer(0);
    const s = new java.lang.Integer(bytes.length);
    return defClass.invoke(classLoader, n, bytes, o, s);
}

/**
 * Triggers `callback` every time the `e` event is posted
 * @param {ForgeEvent} e the forge event to register
 * @param {"HIGHEST" | "HIGH" | "NORMAL" | "LOW" | "LOWEST"} priority the priority you want. valid priorities
 * @param {(event: ForgeEvent) => void} callback
 * @returns {() => void} A function to unregister the event
 *
 * @example
 * const unregister = registerForge(...);
 *
 * unregister();
 */
const registerForge = (e, priority, callback) => {
    const cw = new ClassWriter(0);

    const event = Type.getType(e.class).internalName;
    const name = RandomStringUtils.randomAlphabetic(7);

    const consumer = Type.getType(Consumer.class).internalName;
    const mcForge = Type.getType(MinecraftForge.class).internalName;
    const eventBus = Type.getType(EventBus.class).internalName;
    const subscribeEvent = Type.getType(SubscribeEvent.class).internalName;
    const obj = Type.getType(java.lang.Object.class).internalName;

    cw.visit(Opcodes.V1_8, Opcodes.ACC_PUBLIC, name, null, obj, null);
    // cw.visitInnerClass("net/minecraftforge/event/entity/player/PlayerEvent$BreakSpeed", "net/minecraftforge/event/entity/player/PlayerEvent", "BreakSpeed", ACC_PUBLIC + ACC_STATIC);
    {
        cw.visitField(
            Opcodes.ACC_PRIVATE + Opcodes.ACC_FINAL,
            "callback",
            L(consumer),
            L(consumer + "<" + L(event) + ">"),
            null
        ).visitEnd();
    }
    {
        const con = cw.visitMethod(
            Opcodes.ACC_PUBLIC,
            "<init>",
            "(" + L(consumer) + ")V",
            "(" + L(consumer + "<" + L(event) + ">") + ")V",
            null
        );
        con.visitCode();
        con.visitVarInsn(Opcodes.ALOAD, 0);
        con.visitMethodInsn(Opcodes.INVOKESPECIAL, obj, "<init>", "()V", false);

        con.visitVarInsn(Opcodes.ALOAD, 0);
        con.visitVarInsn(Opcodes.ALOAD, 1);
        con.visitFieldInsn(Opcodes.PUTFIELD, name, "callback", L(consumer));
        con.visitFieldInsn(Opcodes.GETSTATIC, mcForge, "EVENT_BUS", L(eventBus));
        con.visitVarInsn(Opcodes.ALOAD, 0);
        con.visitMethodInsn(
            Opcodes.INVOKEVIRTUAL,
            eventBus,
            "register",
            "(" + L(obj) + ")V",
            false
        );
        con.visitInsn(Opcodes.RETURN);
        con.visitMaxs(2, 2);
        con.visitEnd();
    }
    {
        const mv = cw.visitMethod(
            Opcodes.ACC_PUBLIC,
            "on",
            "(" + L(event) + ")V",
            null,
            null
        );
        {
            const av = mv.visitAnnotation(L(subscribeEvent), true);
            av.visitEnum(
                "priority",
                "Lnet/minecraftforge/fml/common/eventhandler/EventPriority;",
                EventPriority[priority].name()
            );
            av.visitEnd();
        }
        mv.visitCode();
        mv.visitVarInsn(Opcodes.ALOAD, 0);
        mv.visitFieldInsn(Opcodes.GETFIELD, name, "callback", L(consumer));
        mv.visitVarInsn(Opcodes.ALOAD, 1);
        mv.visitMethodInsn(
            Opcodes.INVOKEINTERFACE,
            consumer,
            "accept",
            "(" + L(obj) + ")V",
            true
        );
        mv.visitInsn(Opcodes.RETURN);
        mv.visitMaxs(2, 2);
        mv.visitEnd();
    }
    cw.visitEnd();

    const inst = defineClassBytes(name, cw.toByteArray())
        .getDeclaredConstructor(Consumer.class)
        .newInstance(
            new java.util.function.Consumer({
                accept: function (t) {
                    callback(t);
                },
            })
        );

    const unsubscribe = () => MinecraftForge.EVENT_BUS.unregister(inst);
    LoadedInsts.push(unsubscribe);
    return unsubscribe;
};

register("gameUnload", () => {
    LoadedInsts.forEach((unregister) => unregister());
    LoadedInsts.length = 0;
});

export { registerForge };
