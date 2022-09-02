const { log } = require("../PluginManager")
const PluginManager = require("../PluginManager")

/**
 * @type {import("mineflayer").Bot}
 */
const bot = PluginManager.variables.bot
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder')
const { Lang, print } = PluginManager

bot.loadPlugin(pathfinder)

const mcData = require('minecraft-data')(bot.version)
const defaultMove = new Movements(bot, mcData)
const RANGE_GOAL = 1

PluginManager.add("сюды", (args,message) => {
    const target = bot.players[message.NICK]?.entity
    if (!target) {
        return "Я тя не вижу!"
      }
      const { x: playerX, y: playerY, z: playerZ } = target.position
  
      bot.pathfinder.setMovements(defaultMove)
      bot.pathfinder.setGoal(new GoalNear(playerX, playerY, playerZ, RANGE_GOAL))
    return "иду иду"
})

PluginManager.add("иди", (args)=>{
    const target = args[0]?.entity
    if (!target) {
        return "Я тя не вижу!"
      }
      const { x: playerX, y: playerY, z: playerZ } = target.position
  
      bot.pathfinder.setMovements(defaultMove)
      bot.pathfinder.setGoal(new GoalNear(playerX, playerY, playerZ, RANGE_GOAL))
    return "иду иду"
},{array:["player"]})

PluginManager.add("стой блять",()=>{
    bot.pathfinder.stop()
    return "Ладно ладно"
})
