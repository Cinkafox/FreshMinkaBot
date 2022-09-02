const PluginManager = require("../PluginManager")
const Path = require("../Libs/Map/Path")
const { Lang , print, TaskManager } = PluginManager
/**
 * @type {import("mineflayer").Bot}
 */
const bot = PluginManager.variables.bot

bot.chat("/gm 1")
const Sa = require("../Libs/MicroUtilites")
const { Vec3 } = require("vec3")
const MicroUtilites = new Sa(bot)

PluginManager.add("задача",()=>{
    let out = "Задачи - "
    TaskManager.actions.forEach(a=>{
        out = out + a.toString() + " "
    })
    return out
})

PluginManager.add("иди",(args)=>{
    MicroUtilites.createPath(args[0],async(x,z)=>{
        await MicroUtilites.flyto(new Vec3(x+0.5,args[0].y,z+0.5))
    })
},{array:["vec"]},"test")