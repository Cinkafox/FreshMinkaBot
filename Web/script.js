let urli = window.location.href

function request(urli){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", urli,false); 
    xhr.send();
    return JSON.parse(xhr.responseText)
}
/**
 * add a bot
 * @param {String} nick 
 * @returns {{status:String,message:String}}
 */
function addBot(nick){
    let url = new URL("/addBot",urli)
    if(!nick) return {status:"error",message:"nick is null"}
    url.searchParams.set("nick",nick)
    return request(url)
}
/**
 * list of bots
 * @returns {{status:String,list:[String]}}
 */
function listBots(){
    let url = new URL("/listBots",urli)
    return request(url)
}
/**
 * 
 * @param {String} nick 
 * @param {[String]} command 
 * @returns {{status:String,message:String,response:String}}
 */
function executeBot(nick,command){
    let url = new URL("/executeBot",urli)
    if(!nick || !command) return {status:"error",message:"nick or command is null"}
    url.searchParams.set("nick",nick)
    url.searchParams.set("command",JSON.stringify(command))
    return request(url)
}

/**
 * 
 * @param {String} nick 
 * @param {String} name 
 * @param {String} func 
 * @param {*} args 
 * @returns {{status:String,message:String}}
 */
function addExecution(nick,name,func,args){
    let url = new URL("/addExecution",urli)
    if(!nick || !name || !func) return {status:"error",message:"nick,name,func is null"}
    url.searchParams.set("nick",nick)
    url.searchParams.set("name",name)
    console.log("as:"+name)
    url.searchParams.set("func",func)
    if(args) url.searchParams.set("args",args)
    return request(url)
}

/**
 * 
 * @param {String} nick 
 * @returns {{status:String,message:String,response:{name:String,message:String,type:String}}}
 */
function getLastMessage(nick){
    let url = new URL("/getLastMessage",urli)
    if(!nick) return {status:"error",message:"nick is null"}
    url.searchParams.set("nick",nick)
    return {status:"good",response:request(url)}
}
/**
 * 
 * @param {String} nick 
 * @returns {{status:String,message:String,response:[{name:String,message:String,type:String}]}}
 */
function getLog(nick){
    let url = new URL("/getLog",urli)
    if(!nick) return {status:"error",message:"nick is null"}
    url.searchParams.set("nick",nick)
    return request(url)
}
/**
 * 
 * @param {String} nick 
 * @returns {{status:String,message:String}}
 */
function exit(nick){
    let url = new URL("/exit",urli)
    if(!nick) return {status:"error",message:"nick is null"}
    url.searchParams.set("nick",nick)
    return request(url)
}