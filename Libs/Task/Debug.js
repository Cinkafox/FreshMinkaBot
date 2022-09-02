let lastMessage = {name:"",message:"",type:""}
let Logs = []
class Debug {
    Color = {
        Reset: "\x1b[0m",
        Bright: "\x1b[1m",
        Dim: "\x1b[2m",
        Underscore: "\x1b[4m",
        Blink: "\x1b[5m",
        Reverse: "\x1b[7m",
        Hidden: "\x1b[8m",

        FgBlack: "\x1b[30m",
        FgRed: "\x1b[31m",
        FgGreen: "\x1b[32m",
        FgYellow: "\x1b[33m",
        FgBlue: "\x1b[34m",
        FgMagenta: "\x1b[35m",
        FgCyan: "\x1b[36m",
        FgWhite: "\x1b[37m",

        BgBlack: "\x1b[40m",
        BgRed: "\x1b[41m",
        BgGreen: "\x1b[42m",
        BgYellow: "\x1b[43m",
        BgBlue: "\x1b[44m",
        BgMagenta: "\x1b[45m",
        BgCyan: "\x1b[46m",
        BgWhite: "\x1b[47m",
    }

    name
    defaultFG = "FgWhite"
    defaultBG = "BgBlack"
    type = {}
    funct = console.log
    /**
     * 
     * @param {String} name 
     * @param {'FgBlack' | 'FgBlue' | 'FgCyan' | 'FgGreen' | 'FgMagenta' | 'FgRed' | 'FgWhite' | 'FgYellow' | 'Reset' | 'Bright' | 'Dim' | 'Underscore' | 'Blink' | 'Underscore' | 'Reverse' | 'Hidden'} defaultFG 
     * @param {'BgBlack' | 'BgBlue' | 'BgCyan' | 'BgGreen' | 'BgMagenta' | 'BgRed' | 'BgWhite' | 'BgYellow' | 'Reset' | 'Bright' | 'Dim' | 'Underscore' | 'Blink' | 'Underscore' | 'Reverse' | 'Hidden'} defaultBG 
     * @param {Function} funct 
     */
    constructor(name,defaultFG = "FgWhite", defaultBG = "BgBlack",funct = console.log) {
        this.name = name
        this.funct = funct
        this.defaultBG = defaultBG
        this.defaultFG = defaultFG
    }
    setType(type){
        this.type = type
    }
    /**
     * 
     * @param {String} message 
     * @param {'FgBlack' | 'FgBlue' | 'FgCyan' | 'FgGreen' | 'FgMagenta' | 'FgRed' | 'FgWhite' | 'FgYellow' | 'Reset' | 'Bright' | 'Dim' | 'Underscore' | 'Blink' | 'Underscore' | 'Reverse' | 'Hidden'} FG 
     * @param {'BgBlack' | 'BgBlue' | 'BgCyan' | 'BgGreen' | 'BgMagenta' | 'BgRed' | 'BgWhite' | 'BgYellow' | 'Reset' | 'Bright' | 'Dim' | 'Underscore' | 'Blink' | 'Underscore' | 'Reverse' | 'Hidden'} BG 
     */
    print(message,type=undefined,FG=this.defaultFG,BG=this.defaultBG) {
        if(this.type[type] || !type){
            this.funct(`${this.Color.FgBlack + this.Color.BgBlue + this.Color.Bright + this.Color.Underscore}  DEBUG  ${this.Color.Reset + this.Color[FG] + this.Color[BG] + this.Color.Bright} ${this.name} | ${message}  ${this.Color.Reset}`)
            lastMessage = {name:this.name,message,type}
            Logs.push(lastMessage)
        }
    }
}

function getLastMessage(){
    return lastMessage
}
function getLog(){
    return Logs
}
module.exports = Debug
module.exports.getLog = getLog
module.exports.getLastMessage = getLastMessage