const PluginManager = require("../PluginManager")
let mat = {}
let indx;

PluginManager.add("мат топ",(args,message)=>{
    if(indx == undefined) return "Эмм,может сначала включишь?"
    let max = 0
    let Mi = "Никто"
    let obk = Object.keys(mat)
    obk.forEach(e=>{
        let ins = mat[e]
        if(ins > max){
            Mi = e
            max = ins
        }
    })
    return "МАТЕРШИННИК - " + Mi + " матерился " + max + " раз"
})

PluginManager.add("мат",()=>{
    if(indx !== undefined){
        PluginManager.deleteOnChat(indx)
        indx = undefined
        mat = {}
        return "не слежу"
    }
    indx = PluginManager.addOnChat((me)=>{
        let fa = me.MESSAGE.toLowerCase()
        fa.split(" ").forEach(sa => {
            if(sa.includes("бля") || sa.includes("сук") || sa.includes("шалав") || sa.includes("пизд") || sa.includes("хуй") || sa.includes("хуя") || sa.includes("гей") || sa.includes("еба") || sa.includes("вырод") || sa.includes("пид") || sa.includes("клоун") || sa.includes("пид") || sa.includes("коз"))
            if(mat[me.NICK]) mat[me.NICK]++
            else mat[me.NICK] = 1
        });
    })
    return "слежу"

})

