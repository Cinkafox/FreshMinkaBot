const PluginManager = require("../PluginManager")
const nbt = require('prismarine-nbt')
/**
 * @type {import("mineflayer").Bot}
 */
const bot = PluginManager.variables.bot
const mcData = require('minecraft-data')(bot.version)
const Item = require('prismarine-item')(bot.version)

async function giveBuh(){
    let item = new Item(mcData.itemsByName["potion"].id,1,0,nbt.comp({
        display:nbt.comp({
            Name:nbt.string("\"§a§lМочито§f§l\"")
        }),
        CustomPotionColor:nbt.int(16777215)
    }))
    await bot.creative.setInventorySlot(bot.inventory.firstEmptyInventorySlot(true), item)
    await bot.toss(item.type)
}

PluginManager.add("бухло",()=>{
    if(bot.game.gameMode !== "creative") return "я не в гм але!"
    giveBuh()
})