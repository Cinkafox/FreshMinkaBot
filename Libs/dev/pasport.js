const PluginManager = require("../PluginManager")
const nbt = require('prismarine-nbt')
/**
 * @type {import("mineflayer").Bot}
 */
const bot = PluginManager.variables.bot
const mcData = require('minecraft-data')(bot.version)
const Item = require('prismarine-item')(bot.version)
const fs = require('fs');
bot.chat("/gm 1")
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

/**
 * 
 * @returns {import("../city.json")}
 */
let readFile = () => {
    let obj = JSON.parse(fs.readFileSync('city.json'));
    return obj;
}
let writeFile = (obj) => {
    fs.writeFileSync("city.json",JSON.stringify(obj));
}

let getInfo = (nick)=>{
    return readFile()[nick]
}
let setInfo = (nick,info=undefined,work=undefined)=>{
    let obj = readFile()
    if(obj[nick])
        obj[nick] = {
            id:obj[nick].id,
            info:info,
            work:work
        }
    else
        obj[nick] = {
            id:makeid(4),
            info:info
        }
    writeFile(obj)
}




async function givePassport(nick){
    let item = new Item(mcData.itemsByName["knowledge_book"].id,1,0,nbt.comp({
        display:nbt.comp({
            Name:nbt.string("\"§dПаспорт гражданина §f§l"+nick+"\"")
        })
    }))
    await bot.creative.setInventorySlot(bot.inventory.firstEmptyInventorySlot(), item)
    await bot.toss(mcData.itemsByName["knowledge_book"].id,null,1)
}

function onC(Nick,a = undefined){
    let info = getInfo(Nick)
    if(!info){
        givePassport(Nick)
        setInfo(Nick,a)
        return "Вот ваш паспорт " + Nick
    }
    if(a){
        setInfo(Nick,a)
    }
    return `Айди - ${info.id},Инфа про ${Nick} - ${info.info ? info.info : "отсутсвует"}`
}



PluginManager.add("паспорт инфа",(args,message)=>{
    setInfo(message.NICK,args[0])
    return "Готово!"
},true)
PluginManager.add("паспорт",(args,message)=>{
    return onC(message.NICK)
})
PluginManager.add("паспорт",(args)=>{
    return onC(args[0].username)
},{array:["player"]})
PluginManager.add("паспорт",(args,message)=>{
    return onC(message.NICK,args[0])
},true)
