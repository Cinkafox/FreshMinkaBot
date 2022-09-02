const mineflayer = require("mineflayer");
const path = require("path")
const ChatParser = require("./Libs/Env/ChatParser")
const Permissions = require("./libs/Env/permissions");
const MicroUtilites = require("./Libs/Env/MicroUtilites")
const Debug = require("./Libs/Task/Debug")
let print = console.log


class MinkaBot {
    /**
     * @type {mineflayer.Bot}
     */
    bot
    onExit = ()=>{}
    log = new Debug("Main","FgWhite","BgBlue")
    config
    /**
     * @type {ChatParser}
     */
    ChatParser
    PluginManager = require('./PluginManager')
    /**
     * @type {import('./Language/default.json')}
     */
    language
    /**
     * Новый бот
     * @param {{bot:{username:String,host:String,port:Number,version:String},alias:[String],CustomJoinPath:String,PluginPath:String,LanguagePath:String,SchematicPath:string}} config 
     */
    constructor(config) {
        this.log.setType({
            chat:true,
            init:true
        })
        this.log.print("Setup config","init")
        this.config = config
        this.config.alias.push(this.config.bot.username)
        this.language = require(config.LanguagePath)

        this.log.print("Creating bot..","init")
        this.bot = mineflayer.createBot(config.bot)
        //this.bot.on("message",m=>console.log(m.toString()))
        this.bot.on("kicked",(reason)=>{this.log.print(`Kicked. Reason:${reason}`,undefined,"FgWhite","BgRed")})
        this.bot.on("end", ()=>{this.log.print("bot exit!",undefined,"FgWhite","BgRed");this.onExit()})

        this.PluginManager.Lang = this.language
        this.PluginManager.print = (message)=>{
            this.log.print(message,undefined,"FgWhite","BgMagenta")
            this.bot.chat(this.PluginManager.message.GM + message)
        }
        this.PluginManager.variables = { bot: this.bot ,SchematicPath:path.join(__dirname, this.config.SchematicPath)}
        this.PluginManager.func = MicroUtilites
        
        print = this.PluginManager.print
        this.preInit()
    }

    preInit() {
        this.log.print("Prejoining...","init")
        try {
            let CustomJoin = require(this.config.CustomJoinPath + "/" + this.config.bot.host + ".js")
            this.ChatParser = new ChatParser(CustomJoin.regex, CustomJoin.global,this.bot)
            CustomJoin.preInit(this.bot, () => this.init())
        } catch (error) {
            this.log.print(this.language.CustomJoin.IsCreated)
            require('fs').cpSync(config.CustomJoinPath + "/default.js", this.config.CustomJoinPath + "/" + this.config.bot.host + ".js")
            this.bot.removeAllListeners()
            this.bot.quit()
            //process.exit(1)
        }
    }

    init() {
        this.log.print("Init plugins","init")
        this.PluginManager.loadFromDir(path.join(__dirname, this.config.PluginPath))
        this.PluginManager.add("рестарт", (args) => {
            this.log.print("Reload..","init")
            this.bot.chat("Перезапускаюсь!")
            this.bot.removeAllListeners()
            this.bot.once("kicked",(reason)=>{this.log.print(`Kicked. Reason:${reason}`,undefined,"FgWhite","BgRed")})
            this.bot.once("end", ()=>{this.log.print("bot exit!",undefined,"FgWhite","BgRed");this.onExit()})
            this.init();
            return "Готово!"
        },undefined,"рестарт")
        this.bot.on("message", m => {
            this.PluginManager.execMess(m)
            this.onChat(m.toString())
        })
    }
    onChat(message) {
        let text = this.ChatParser.parse(message)
        if (!text) return undefined
        this.log.print(`${text.NICK} > ${text.GM}${text.MESSAGE}`,"chat")
        this.PluginManager.execChat(text)
        let Splited = text.MESSAGE.split(" ")
        if(text.GM == "/er") Splited = [this.config.alias[0],...Splited]
        let Nick = Splited.shift()
        if (this.config.alias.indexOf(Nick) == -1) return
        let out = this.PluginManager.execute(Splited.join(" "), text)
        if(out.status === "error" && out.e != 1){
            print(this.PluginManager.Lang.PluginManager.error.replace("$e", out.e).replace("$r", (out.response ? out.response : "")))
            return
        }
        if(out.status === "good" && (out.permission == null || Permissions.check(Permissions.readUser(text.NICK),out.permission))){
            try{
                let str = out.response()
                if(str && typeof str === "string") print(str)
            }catch(e){
                this.log.print(e.message)
            }
            return
        }
        if(out.status === "prompt"){
            print(out.response.join(" "))
        }

        
    }
}
new MinkaBot(require("./config.json"))
module.exports = MinkaBot