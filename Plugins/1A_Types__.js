const PluginManager = require("../PluginManager")
/**
 * @type {import("mineflayer").Bot}
 */
const bot = PluginManager.variables.bot
const {message} = PluginManager.message
const fs = require('fs')
const { Schematic } = require('prismarine-schematic')
const {Vec3} = require("vec3")

PluginManager.addType("player",(inp)=>{
    let player = PluginManager.variables.bot.players[inp]
    if(player == undefined) throw {message:"Player not found"}
    return player
})

PluginManager.addType("schem",(inp)=>{
    let fav = fs.readFileSync(PluginManager.variables.SchematicPath + "/" + inp + ".schematic")
    return async()=>{return await Schematic.read(fav,PluginManager.variables.bot.version)}
})

PluginManager.addType("URL",(inp)=>{
    if(inp.split(".").length < 2) throw {message:"Is not url!"}
    return inp
})

PluginManager.addType("ustring",(inp)=>{
    if(inp == undefined) throw {message:"String is undefined"}
    return inp
})

PluginManager.addType("vec",(inp)=>{
    let xyz = inp.split(",")
    if(xyz.length !== 3) throw {message:"Is not vector!"}
    for(let i = 0;i<3;i++){
        let e = xyz[i]
        if(e[0] == "~") xyz[i] = (bot.entity.position[String.fromCharCode(120+i)] + Number(e.substring(1)) )
        else xyz[i] = Number(xyz[i])
        if(isNaN(xyz[i])) throw {message:e + " is not number!"}
    }
    return new Vec3(xyz[0],xyz[1],xyz[2])
})