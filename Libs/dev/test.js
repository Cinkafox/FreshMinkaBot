const PluginManager = require("../../PluginManager")
const Path = require("../../Libs/Map/Path")
const { Lang , print, TaskManager } = PluginManager
/**
 * @type {import("mineflayer").Bot}
 */
const bot = PluginManager.variables.bot

bot.chat("/gm 1")
const Sa = require("../../Libs/MicroUtilites")
const { Vec3 } = require("vec3")
const MicroUtilites = new Sa(bot)

PluginManager.add("задача",()=>{
    let out = "Задачи - "
    TaskManager.actions.forEach(a=>{
        out = out + a.toString() + " "
    })
    return out
})
PluginManager.add("задача добавить",(args)=>{
    return TaskManager.addAction(()=>{
        console.log(args[0])
    })

},{array:["string"]})

PluginManager.add("иди",(args)=>{
    let p = new Path(args[0],bot.entity.position,bot)
    p.start()
    return "Иду " + args[0]
},{array:["vec"]})

PluginManager.add("ставь",(args)=>{
    MicroUtilites.goAndPlace(1,args[0],args[1])
},{array:["vec","vec"]})

PluginManager.add("строй",(args)=>{
   TaskManager.addAction(async () =>{
    await MicroUtilites.goAndPlace(1,args[0],new Vec3(0,1,0))
   })
   TaskManager.addAction(async () =>{
    await MicroUtilites.goAndPlace(1,args[0].offset(-1,0,0),new Vec3(-1,0,0))
   })
   TaskManager.addAction(async () =>{
    await MicroUtilites.goAndPlace(1,args[0].offset(1,0,0),new Vec3(1,0,0))
   })
   TaskManager.addAction(async () =>{
    await MicroUtilites.goAndPlace(1,args[0].offset(0,1,0),new Vec3(0,1,0))
   })
   TaskManager.addAction(async () =>{
    await MicroUtilites.goAndPlace(1,args[0].offset(0,2,0),new Vec3(0,1,0))
   })
   TaskManager.run()
   return "Х У ЯРЮ ВО ИМЯ КПСС!"
},{array:["vec"]})


PluginManager.add("задача выполнить",()=>{
    TaskManager.run()
})


