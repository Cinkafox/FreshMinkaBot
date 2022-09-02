class ChatParser{
    regex
    global
    bot
    constructor(regex,global,bot = undefined){
        this.regex = regex
        this.global = global
        this.bot = bot
    }
    parse(message){
        let m = message.matchAll(this.regex)
        m = Array.from(m)[0]
        if(m == null) return
        let NICK = m.groups["G"] ? m.groups["Nick"] : m.groups["NickL"]
        NICK.split(" ").forEach(element => {
            if(this.bot.players[element] == undefined) return
            NICK = element
        });
        return {NICK,MESSAGE:m.groups["G"] ? m.groups["Chat"].trim() : m.groups["ChatL"],GM:m.groups["G"] ? (m.groups["G"] == this.global ? "!" : "") : "/er",Player:this.bot.players[NICK]}
    }
}

module.exports = ChatParser