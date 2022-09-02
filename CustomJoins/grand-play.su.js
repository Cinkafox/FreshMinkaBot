const Auth = require("./auth/Auth");
const PNGImage = require('pngjs-image');
const {Vec3} = require("vec3");
const ReadText = require('text-from-image')
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

function check(colorId){
    return colorId !==0 && colorId !==207
}

function preInit(bot,success){
    let onCheck = ()=>{
        bot._client.on('map', ({ data }) => {
	
            if(!data) return;
        
            const size = Math.sqrt(data.length);
        
            const image = PNGImage.createImage(size, size);
            
            for(let x = 0; x < size; x++) {
            
                for(let z = 0; z < size; z++) {
        
                    const colorId = data[x + (z * size)];
                    if(check(colorId) || check(data[x + (z * size) + 1]) || check(data[x + (z * size) - 1]) || check(data[x + ((z+1) * size)]) || check(data[x + ((z-1) * size)])) image.setAt(x, z, { red: 0, green: 0, blue: 0, alpha: 255 });
                    else image.setAt(x, z, { red: 255, green: 255, blue: 255, alpha: 255 });
                    //console.log(image.getAt(x,z))
        
                }
            
            }

            


            image.writeImage(`${__dirname}/map.png`, function (err) {
                if (err) throw err;
                
                console.log('Written to the file');
                ReadText(`${__dirname}/map.png`).then(text => {
                    text = text.replace("¢","c")
                    console.log(text);
                    bot.chat(text)
                }).catch(err => {
                    console.log(err);
                })
            });

            
        
        
        });
        Auth.check(bot,action);
    }
    const action = [{message:"ＧＷ >> Пожалуйста, решите капчу, у вас есть 3 попыток.",action:onCheck},{message:"ＧＷ >> Вы неправильно ввели капчу, у вас осталось 2 попыток.",action:()=>{throw Error("Блять капча ебанная(")}},{message:"Авторизация >>  Пожалуйста, войдите на сервер, используя /login <пароль> , у вас есть 3 попытки.",action:()=>{bot.chat("/l 12341")}},{message:"Авторизация | Зарегистрируйтесь, /register",action:()=>{bot.chat("/reg 12341 12341")}}];
    Auth.check(bot,action);
    onStart(bot,()=>{
        bot.setQuickBarSlot(0)
        bot.activateItem()
        bot.once('windowOpen', (w) => {
            bot.clickWindow(23,0,0);
            success();
        })
    })
    
}

module.exports = {regex,preInit,global}