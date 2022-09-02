let div = document.getElementById('window');
//div.innerHTML = "<h1>Aa</h1>"

function mainPage(){
    let list = listBots()
    let tx = '<div id="list"><ul>'
    list.list.forEach(e=>{
        tx += `<li><a onClick="checkBotPage('${e}')">${e}</a></li>`
    })
    tx += '</ul></div><button onClick="addBotPage()">Создать бота</button></div>'
    div.innerHTML = tx
}

function addBotPage(){
    div.innerHTML = `<form action="">
    <input type="button" onClick="mainPage()" value="Назад">
    <input id="nick" required>
    <input type="button" onclick="checkNick()" value="Подвердить">
    </form>`
}
function checkNick(){
    let nick = document.getElementById('nick').value
    if(!nick) return 0
    addBot(nick)
    mainPage()
}

function checkBotPage(nick){
    let txt = ""
    let o = getLog(nick)
    console.log(o)
    if(o.status == "good"){
        o.response.forEach(b=>{
           txt += "<p>"+b.name + "|" + b.message+"</p>" 
        })
    }else{
        txt= o.message
    }
    div.innerHTML = txt
}
mainPage()