const Auth = require("./auth/Auth");
const {Vec3} = require("vec3");
const regex = /«(?<G>.*)» \| (.(.*?).){0,1} .(.*?). (?<Nick>.*?) ➥ (?<Chat>.*)|\[.*? (?<NickL>.*?) -> я\] (?<ChatL>.*)/gm;
let global = "Ⓖ";

let ch = 0;
function onStart(bot,success){
    bot.once("message",(m) => {
        let ac = m.toString();
        if(ac === "➣ Выберите портал для игры"){
            if(ch<4){
                ch++;
                return onStart(bot,success);
            }
            success();
            return "donre"
        }
        else if(ac === "АНТИ БОТ ≫ Пройди капчу перед тем как двигаться!"){
            ch = 0
            Auth.antbotchest(bot)
            return onStart(bot,success);
        }   
        else{
            return onStart(bot,success);
        }
    });
}

function preInit(bot,success){
    const action = [{message:">> Ожидайте завершения проверки...",action:"rec"},{message:"Авторизация | Войдите в игру, введя пароль /login",action:()=>{bot.chat("/l 12341")}}];
    Auth.check(bot,action);
    onStart(bot,()=>{
        bot.setControlState('forward',true);
        bot.lookAt(new Vec3(-348,63,440));
            setTimeout(() => {
                bot.setControlState('forward', false);
                success();
            },10000);
    })
    
}

module.exports = {regex,preInit,global}