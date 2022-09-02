const { log } = require("../PluginManager")
const PluginManager = require("../PluginManager")
const parse = require("../Libs/Task/NameParser")
/**
 * @type {import("mineflayer").Bot}
 */
const bot = PluginManager.variables.bot
const { Lang, print } = PluginManager


PluginManager.add("инвентарь", (args,message) => {
    let out = "вещи > "
    let items = bot.inventory.items()
    if (require('minecraft-data')(bot.version).isNewerOrEqualTo('1.9') && bot.inventory.slots[45]) items.push(bot.inventory.slots[45])

    items.forEach(i=>{
        log.print(i.type)
        out+= ` ${parse.romanize(i.slot)}) ${i.customName ? parse.parse(JSON.parse(i.customName)) : i.displayName}`
    })
    return out
})

PluginManager.add("инвентарь очистить",()=>{
    if(bot.game.gameMode !== "creative") return "Сори никак!"
    bot.creative.clearInventory()
    return "Усе!"
})


PluginManager.add("инвентарь выбери",(args)=>{
    bot.setQuickBarSlot(args[0])
    return "готово"
},{array:["number"]})