const PluginManager = require("../PluginManager")
/**
 * @type {import("mineflayer").Bot}
 */
const bot = PluginManager.variables.bot
const { RandomArray, RandomPlayer } = PluginManager.func
const { Lang, print } = PluginManager

let who1 = Lang.Plugins.Who.who1
let who2 = Lang.Plugins.Who.who2
let truefalse = Lang.Plugins.Who.randYes
let mem = {}

PluginManager.add(Lang.Plugins.Who.who, () => {
    return Lang.Plugins.Who.whowhat
})

PluginManager.add(Lang.Plugins.Who.who, (args) => {
    return PluginManager.parseLang(Lang.Plugins.Who.Text, { "$nick": args[0]?.username, "$who": (mem[args[0]?.username] = mem[args[0]?.username] ? mem[args[0]?.username] : (RandomArray(who1) + " " + RandomArray(who2))) })
}, { array: ["player"] })

PluginManager.add(Lang.Plugins.Who.who, (args) => {
    return PluginManager.parseLang(Lang.Plugins.Who.Text,{"$nick":args[0],"$who":RandomPlayer(bot)})
}, true)

PluginManager.add(Lang.Plugins.Who["who i"], (args, message) => {
    return Lang.Plugins.Who.Text.replace("$nick", message.NICK).replace("$who", (mem[message.NICK] = mem[message.NICK] ? mem[message.NICK] : (RandomArray(who1) + " " + RandomArray(who2))))
})

PluginManager.add("инфа",()=>{
    return "Где то " + Math.floor(Math.random()*100) + "%"
},true)

PluginManager.add("выбери",(args)=>{
    let vibor = args[0].split("или")
    return "Я выбираю " + RandomArray(vibor)
},true);

PluginManager.add("правда",()=>{
	return RandomArray(truefalse)
},true);

PluginManager.add("напиши",(args)=>{
	let str = args[0]
    if(str[0] == "/"){
        bot.once("message",m=>{
            print(m.toString())
        })
    }
    bot.chat(str)
    return 
},true,"печать");

PluginManager.add("тп",(args,message)=>{
	bot.chat("/tpa CinemaFoxProd")
});
