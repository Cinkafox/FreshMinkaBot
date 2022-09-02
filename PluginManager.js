const fs = require("fs");

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    require(module);
}

class PluginManager {
    Lang = require("./Lang/default.json")
    TaskManager = new (require("./Libs/Task/TaskManager"))()
    print = console.log

    Debug = require("./Libs/Task/Debug")
    message = {GM:"",MESSAGE:"",NICK:""}
    func = {}
    onChat = []
    onMessage = []
    variables = {}
    plugins = {}
    types = {}
    log = new this.Debug("PM","FgWhite","BgCyan")
    regex = /\[(.*?)\] |\((.*?)\) |"(.*?)" |(.*?) /g

    constructor(){
        this.log.setType({
            load:true,
            length:false,
            add:true,
            type:true,
            execute:true,
            _execute:true
        })
    }
    __length(a) {
        this.log.print(JSON.stringify(a),"length")
        if(!a.args) return 0
        if (a.args == true) return 1
        return (a.args.array ? a.args.array.length : 0 + Object.keys(a.args).length) * 2
    }
    /**
     * выполняемая функция
     * @callback execfunc
     * @param {object} args
     * @param {{GM:String,NICK:String,MESSAGE:String,Player:import("mineflayer").Player}} message
     */
    /**
     * Добавление функции в менеджер плагинов!
     * @param {String} name 
     * @param {execfunc} func 
     * @param {{array:[String]}} args 
     * @param {String} help 
     */
    add(name, func, args = { array: [] },permission=undefined, help = "") {
        this.log.print(`added ${name}`,"add")
        this._add(name.split(" "), func, args, help,permission)
    }
    _add(name, func, args = { array: [] }, help = "",permission=undefined, obj = this.plugins) {
        let index = name.shift(1)
        if (name[0]) {
            if (!obj[index]) obj[index] = {}
            return this._add(name, func, args, help,permission, obj[index])
        } else {
            if (obj[index]) {
                if (!obj[index].array) {
                    let temp = obj[index]
                    obj[index] = {}
                    obj[index].array = [temp]
                }
                obj[index].array.push({
                    isObject: true,
                    args,
                    help,
                    func,
                    permission
                })
                obj[index].array.sort((a, b) => {
                    let la = this.__length(a)
                    let lb = this.__length(b)
                    let s = lb - la
                    if (s > 0) return 1
                    if (s < 0) return -1
                    if (s == 0) return 0
                })
            } else obj[index] = {
                isObject: true,
                args,
                help,
                func,
                permission
            }
            return true
        }
    }
    /**
     * функция выполнения с чатом
     * @callback execchat
     * @param {{GM:String,NICK:String,MESSAGE:String,Player:import("mineflayer").Player}} message
     */
    /**
     * Добавление функции выполняемый с чатом
     * @param {execchat} func 
     */
    addOnChat(func){
        this.log.print(`added on chat`,"add")
        return (this.onChat.push(func)-1)
    }

    /**
     * @callback execMess
     * @param {import("prismarine-chat").ChatMessage} message
     */
    /**
     * 
     * @param {execMess} func 
     * @returns 
     */

    addOnMessage(func){
        
        return (this.onMessage.push(func)-1)
    }


    deleteOnChat(index){
        this.log.print(`deleted on chat`,"add")
        return this.onChat.splice(index,1)
    }
    /**
     * @callback typefunc
     * @param {String} input
     */
    /**
     * Добавление типа данных
     * @param {String} type 
     * @param {typefunc} func 
     */
    addType(type, func) {
        this.log.print(`Added type ${type}`,"type")
        this.types[type] = func
    }
    parseLang(str, obj) {
        let s = Object.keys(obj)
        s.forEach(element => {
            str = str.replace(element, obj[element])
        });
        return str
    }
    recamp(inp, obj = "string") {
        this.log.print(`Type ${inp},${obj}`,"type")
        let funct = this.types[obj]
        if (funct) return funct(inp)
        return eval(inp)
    }
    execChat(message){
        this.message = message
        this.onChat.forEach(e=>{
            e(message)
        })
    }
    execMess(message){
        this.onMessage.forEach(e=>{
            e(message)
        })
    }
    /**
     * execute
     * @param {String} inp 
     * @param {{GM:String,NICK:String,MESSAGE:String,Player:import("mineflayer").Player}} message 
     * @returns {{status:'good',permission:String,help:String,response:Function}|{status:"error",e:Number,response:String}|{status:"prompt",response:[String]}}
     */
    execute(inp, message) {
        this.log.print(`executing ${inp}`,"execute")
        let m = (inp + " ").matchAll(this.regex)
        m = Array.from(m)
        let args = []
        m.forEach(e => {
            args.push(e[0].trim())
        })
        let out = this._execute(args, message)
        this.log.print(`OUT => ${JSON.stringify(out)}`,"execute")
        return out
    }
    /**
     * 
     * @param {[String]} inp 
     * @param {{GM:String,NICK:String,MESSAGE:String,Player:import("mineflayer").Player}} message 
     * @param {boolean} isArgs 
     * @param {{array:[String]}} args 
     * @param {{isObject:true,args:{array:[String]},help:String,permission:String,func:Function}} funct 
     * @param {*} obj 
     * @returns {{status:'good',permission:String,help:String,response:Function}|{status:"error",e:Number,response:String}|{status:"prompt",response:[String]}}
     */
    _execute(inp, message, isArgs = false, args = { array: [] }, funct = undefined, obj = this.plugins) {
        let index = inp.shift(1)
        let objIndex = obj[index]
        let isArray = (objIndex && (objIndex.array && !objIndex[inp[0]]))
        let isChem = (typeof objIndex?.args == "boolean" && objIndex.args)
        this.log.print(JSON.stringify({index,isArray,isArgs,objIndex,args,isChem,}),"_execute")
        if (index !== undefined && !isArray && !isChem) {
            if (isArgs) {

                this.log.print(`INDEX ${index}`,"_execute")
                let isEq = index.toString().split("=")
                try {
                    this.log.print(`Args builder:${JSON.stringify({array:funct.args.array,length:args.array.length,index})}`,"_execute")
                    if (isEq[1]) args[isEq[0]] = this.recamp(isEq[1], funct[isEq[0]])
                    else args.array.push(this.recamp(isEq[0], funct.args.array[args.array.length]))
                } catch (e) {
                    console.log(e)
                    return { status: "error", e: 3, response: e.message }
                }
            }

            if (!objIndex && !isArgs) return { status: "error", e: 1 }
            return this._execute(inp, message, (isArgs ? isArgs : objIndex?.isObject) && !(objIndex ? objIndex[inp[0]]?.isObject : undefined), args, (objIndex?.isObject ? objIndex : funct), objIndex)
        } else {
            if (isChem) {
                if (inp.length == 0) return { status: "error", e: 5, response: "No arg" }
                args.array[0] = inp.join(" ")
                this.log.print("Start func 1","stfunc")
                //return { status: "good", response: objIndex.func({ ...args.array, args }, message) } 
                return {status:"good",permission:objIndex.permission,help:objIndex.help,response:()=>{
                    return objIndex.func({ ...args.array, args }, message) 
                }}
            }
            if (isArray) {
                let out
                for (let i = 0; i < objIndex.array.length; i++) {
                    try{
                        out = this._execute([i, ...inp], message, isArgs, { array: [] }, funct, { ...objIndex.array })
                        this.log.print(`OUT => ${JSON.stringify(out)}`,"_execute")
                        if (out.status == "good") return out
                    }catch{

                    }
                }
                return out
            }
            if (!funct) {
                if (!obj) return { status: "error", e: 5 }
                return { status: "prompt", response: Object.keys(obj) }
            }


            let chk = this.checkMises(args, funct.args)
            if (chk.length !== 0) {
                let str = ""
                chk.forEach(o => {
                    str += this.Lang.PluginManager.extends + "-" + o.extends + " " + this.Lang.PluginManager.got + "-" + o.got + " " + this.Lang.PluginManager.in + "-" + o.in + "|"
                })
                return { status: "error", e: 2, response: str }
            }

            this.log.print(`Start func 2 ${args}`,"stfunc")
            return {status:"good",permission:funct.permission,help:funct.help,response:()=>{
                return funct.func({ ...args.array, args }, message) 
            }}
        }
    }

    checkMises(args, cha) {
        let skipped = []
        Object.keys(cha).forEach(o => {
            let cha1 = cha[o]
            let args1 = args[o]
            if (Array.isArray(cha1)) return skipped = skipped.concat(this.checkMises(args1, cha1))
            this.log.print(`check ${o}:${args1}`,"chkargs")
            if (typeof args1 != cha1 && typeof args1 != "object" && !this.types[cha1] || args1 == undefined) skipped.push({ extends: cha1, got: (typeof args1), in: o })
        })
        return skipped
    }

    getAllArgs(cha) {
        let skipped = []
        Object.keys(cha).forEach(o => {
            let cha1 = cha[o]
            if (Array.isArray(cha1)) return skipped = skipped.concat(this.getAllArgs(cha1))
            skipped.push([o, cha1])
        })
        return skipped
    }

    loadFromDir(normalizedPath) {
        this.plugins = {}
        this.types = {}
        let log = this.log
        fs.readdirSync(normalizedPath).forEach(function (file) {
            try {
                log.print(`Loading ${file}...`,"load")
                requireUncached(normalizedPath + "/" + file)
            } catch (e) {
                log.print(e,"load","FgBlack","BgRed")
            }
        });
    }
}
module.exports = new PluginManager()