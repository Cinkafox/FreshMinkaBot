const MinkaBot = require("./index")
const http = require("http")
const fs = require('fs').promises
const regex = /\[(.*?)\] |\((.*?)\) |"(.*?)" |(.*?) /g

const host = 'localhost';
const port = 80;
let log = {}
/**
 * @type {{:MinkaBot}}
 */
let bots = {}

function addBot(query){
    let {nick} = query
    if(bots[nick] !== undefined) return {status:"error",message:"bot is exist!"}
    if(!nick) return {status:"error",message:"nick is null"}
    let cnfg = require("./config.json")
    cnfg.bot.username = nick
    bots[nick] = (new MinkaBot(cnfg))
    bots[nick].onExit = ()=>{
        log[nick] = bots[nick].PluginManager.Debug.getLog()
        bots[nick]=undefined
        delete bots[nick]
    }
    return {status:"good"}
}

function listBots(){
   return {status:"good",list:Object.keys(bots)}
}


function executeBot(query){
    let {nick,command} = query
    /**
     * @type {MinkaBot}
     */
    let bot = bots[nick]
    if(!bot) return {status:"error",message:"bot is null"}
    try{
        let args = JSON.parse(command)
        bot.PluginManager.message = {GM:"",MESSAGE:"",NICK:"Console"}
        let out = bot.PluginManager._execute(args, {GM:"",NICK:"Console",MESSAGE:command})
        if(out.status == "good") return {status:"good",response:out.response()}
        else return out
    }catch(e){
        return {status:"error",message:e.message}
    }
}

function addExecution(query){
    let {nick,name,func,args} = query
    let bot = bots[nick]
    if(!bot || !name) return {status:"error",message:"bot or name is null"}
    try{
        let f = eval(func)
        let a = eval(args)
        if(typeof f !== "function") return {status:"error",message:"is not function"}
        bot.PluginManager.add(name,f,a)
        return {status:"good"}
    }catch(e){
        return {status:"error",message:e.message}
    }
}
function getLastMessage(query){
    let {nick} = query
    let bot = bots[nick]
    if(!bot) return {status:"error",message:"bot is null"}
    return {status:"good",response:bot.PluginManager.Debug.getLastMessage()}
}

function getLog(query){
    let {nick} = query
    if(log[nick]) return log[nick]
    let bot = bots[nick]
    if(!bot) return {status:"error",message:"bot is null"}
    return {status:"good",response:bot.PluginManager.Debug.getLog()}
}

function exit(query){
    let {nick} = query
    let bot = bots[nick]
    if(!bot) return {status:"error",message:"bot is null"}
    bot.bot.quit()
    return {status:"good"}
}



let functions = {
    addExecution,
    executeBot,
    listBots,
    addBot,
    getLog,
    getLastMessage,
    exit
}

/**
 * parsing url
 * @param {String} url 
 */
function parse(url){
    let a = url.split("?")
    let query = {}
    if(!a[1]) return {path:a[0].substring(1),query}
    let b = a[1].split("&")
    b.forEach(c=>{
        let d = c.split("=")
        query[d.shift(1)] = decodeURIComponent(d.join("=").replace(/\+/g, '%20'))
    })
    return {path:a[0].substring(1),query}
}

/**
 * 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
const requestListener = function (req, res) {
    let parsed = parse(req.url)
    console.log(parsed,req.url)
    let func = functions[parsed.path]
    if(!func){
        let name = parsed.path
        if(name == "") name = "index.html"
        let contenttype = "text/html"
        if(name.split(".")[1] == "js") contenttype = "text/javascript"

        fs.readFile(__dirname + "/Web/" + name)
        .then(contents => {
            res.setHeader("Content-Type", contenttype);
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(404);
            res.end("Not found");
            return;
        });
    }else{
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end(JSON.stringify(func(parsed.query)));
    }
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Сервер работает на http://${host}:${port}`);
});