let RandomArray=(array)=>{
    return array[Math.floor(Math.random()*array.length)]
}
let RandomPlayer=(bot)=>{
    return bot.players[Object.keys(bot.players)[Math.floor(Math.random()*Object.keys(bot.players).length)]].username
}


module.exports = {RandomArray,RandomPlayer}