const PluginManager = require("../PluginManager")
/**
 * @type {import("mineflayer").Bot}
 */
const bot = PluginManager.variables.bot
const { Lang, print } = PluginManager
const mcData = require('minecraft-data')("1.13.2")
const Utilites = require("../Libs/MicroUtilites")
const { Vec3 } = require("vec3")
const MicroUtilites = new Utilites(bot)
const size = {x:128,z:128}

PluginManager.add("арт",async(args)=>{
    /**
     * @type {import("prismarine-schematic").Schematic}
     */
    let schematic = await args[0]()
    console.log(schematic)
    const at = bot.entity.position.floored().offset(0,2,0);
    let firts = true
    function getItem(x,z){
        let name = schematic.getBlock(new Vec3(x+1,1,z+1)).name
        let id = mcData.itemsByName[name].id
        console.log(name,id)
        return id
    }
    for(let x = 0;x<size.x;x++){
        if (!(x % 2 === 0)){
            
            while(true){
                try{
                    await MicroUtilites.flyto(at.offset(x+0.5,0,size.z-0.5))
                    await MicroUtilites.placeBlock(getItem(x,size.z-1),at.offset(x-1,0,size.z-1),new Vec3(0,0,1),false)
                    await MicroUtilites.goAndPlace(getItem(x,size.z-1),at.offset(x,0,size.z-1),new Vec3(1,0,0),false)
                    await MicroUtilites.flyto(at.offset(x+1,0,size.z-3))
                    await MicroUtilites.goAndPlace(getItem(x,size.z-2),at.offset(x,0,size.z-2),new Vec3(0,0,-1),false)
                    break
                }catch{
                    console.log(e)
                }
            }
            
            for (let z = size.z - 3; z > 0; z--) {
                try{
                    await MicroUtilites.goAndPlace(getItem(x,z),at.offset(x,0,z),new Vec3(0,0,-1),true)
                }catch{
                    let player = bot.nearestEntity(e=>{return e.position.distanceTo(bot.entity.position)<2})
                    if(player !== null){
                        console.log(player.username,"Долбоеб!")
                        z+=1
                        continue
                    }
                    z+=2
                }
            }
        }else{
            
            while(true){
                try{
                    if(!firts){
                        await MicroUtilites.flyto(at.offset(x+0.5,0,0.5))
                        await MicroUtilites.placeBlock(getItem(x,0),at.offset(x-1,0,0),new Vec3(0,0,-1),false)
                    }else firts = false
                    await MicroUtilites.goAndPlace(getItem(x,0),at.offset(x,0,0),new Vec3(1,0,0),false)
                    await MicroUtilites.flyto(at.offset(x+1,0,2))
                    await MicroUtilites.goAndPlace(getItem(x,1),at.offset(x,0,1),new Vec3(0,0,1),false)
                    break        
                }catch(e){
                    console.log(e)
                }
            }
            for (let z = 3; z <= size.z - 2; z++) {
                try{
                    await MicroUtilites.goAndPlace(getItem(x,z),at.offset(x,0,z),new Vec3(0,0,1),true)
                }catch{
                    let player = bot.nearestEntity(e=>{return e.position.distanceTo(bot.entity.position)<2})
                    if(player !== null){
                        console.log(player.username,"Долбоеб!")
                        z-=1
                        continue
                    }
                    z-=2
                }
            }
        }
    }
},{array:["schem"]})
