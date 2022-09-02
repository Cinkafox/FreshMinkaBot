const PluginManager = require("../PluginManager")
/**
 * @type {import("mineflayer").Bot}
 */
const bot = PluginManager.variables.bot

PluginManager.addOnMessage(m=>{
    if(!m.extra || m.extra.length !== 4 || m.extra[1].clickEvent?.value == undefined) return
    bot.chat(m.extra[1].clickEvent?.value)
})

PluginManager.add("секс",(a,m)=>{
    bot.chat("/sex accept " + m.NICK)
})