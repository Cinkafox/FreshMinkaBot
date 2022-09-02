const bdj = require("./auth/Auth");
const {Vec3} = require("vec3");
const regex = /\[(?<G>.*)\] (.*?) .*\|(.* ?) (?<Nick>.*?) (➥|➦) (?<Chat>.*)|\[(?<NickL>.*?) -> Я\] (?<ChatL>.*)/gm;
let global = "G";

function preInit(bot,success){
    const action = [{message:"GreenWorld>> Ожидайте завершения проверки...",action:"rec"},{message:"[GREENWORLD] Сессия недействительна.",action:"rec"},{message:"GreenWorld>> Проверка пройдена, приятной игры",action:"rec"},{message:"Для авторизации пиши - /login [пароль]",action:()=>{bot.chat("/l 12341")}}];
    bdj.check(bot,action);
    
    console.log("joining")
    bot.once("message",() => {
        bot.setQuickBarSlot(0)
        bot.activateItem()
        bot.once('windowOpen', (w) => {
            bot.clickWindow(3,0,0);
            bot.once('windowOpen', (w) => {
                bot.clickWindow(3,0,0);
                success();
            })
        })
    });

}

module.exports = {regex,preInit,global}