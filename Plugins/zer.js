const PluginManager = require("../PluginManager")
/**
 * @type {import("mineflayer").Bot}
 */
const bot = PluginManager.variables.bot
const TaskManager = new (require("../Libs/Task/TaskManager"))
const mcData = require('minecraft-data')("1.13.2")
const Utilites = require("../Libs/MicroUtilites")
const { Vec3 } = require("vec3")
const { log } = require("../PluginManager")
const MicroUtilites = new Utilites(bot)
let pos
/**
 * @type {import("prismarine-entity").Entity}
 */
let player
let veca = new Vec3(-1.0, 1.0, -1.0)
let enabled = true


/**
 * 
 * @param {import("prismarine-block").Block} oldBlock 
 * @param {import("prismarine-block").Block} newBlock 
 */
function zerkalo(oldBlock, newBlock) {
    let delta = newBlock.position.minus(pos)
    let ppos = player.position.clone()
    let pdelta = ppos.minus(pos)

    let newPos = pos.offset(delta.x * veca.x, delta.y * veca.y, delta.z * veca.z)
    let newpPos = pos.offset(pdelta.x * veca.x+0.5, pdelta.y * veca.y, pdelta.z * veca.z+0.5)

    let blockAtNewPos = bot.blockAt(newPos)
    let look = { "yaw": player.yaw + Math.PI, "pitch": player.pitch }

    if (newBlock.type === blockAtNewPos.type) return
    TaskManager.addAction(async () => {
        await bot.creative.flyTo(newpPos)
        await bot.look(look.yaw, look.pitch, true)

        if (newBlock.type === 0) {
            //await bot.dig(blockAtNewPos,true)
            return
        }

        let blockAtCursor = bot.blockAtCursor()
        let face = newPos.minus(blockAtCursor.position)
        console.log("face", face, " BlockAtCursorPos", blockAtCursor.position)
        if(Math.abs(face.x)+Math.abs(face.y)+Math.abs(face.z)>1) throw {message:"face is not well"}
        await MicroUtilites.equipItem(mcData.itemsByName[newBlock.name].id)
        await bot._placeBlockWithOptions(blockAtCursor, face, { swingArm: 'right', forceLook: 'ignore' })
        //    await MicroUtilites.placeBlock(mcData.itemsByName[newBlock.name] ? mcData.itemsByName[newBlock.name].id : 0,newPos,new Vec3(0,1,0),false)
    })
}

PluginManager.add("зеркало", (a, message) => {
    if (!message?.Player?.entity) return "чет у тя ник не четкий!"
    bot.chat("/gm 1")
    player = message.Player.entity
    pos = message.Player.entity.position.floor().clone()
    console.log(pos)
    if (enabled) bot.on("blockUpdate", zerkalo)
    else {
        TaskManager.removeAllActions()
        bot.off("blockUpdate", zerkalo)
    }
    enabled = !enabled
    return enabled ? "Все перестаю!" : "Строю!"
})

PluginManager.add("зи", (a, message) => {
    if (!message?.Player?.entity) return "чет у тя ник не четкий!"
    bot.on("entitySwingArm", e => {
        log.print(e.username)
    })
})