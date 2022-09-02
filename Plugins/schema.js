const PluginManager = require("../PluginManager")
const http = require('https');
const fss = require('fs');


PluginManager.add("схема скачать",(args,message)=>{
    var file = fss.createWriteStream(PluginManager.variables.SchematicPath + "/" + args[1] + ".schematic");
    http.get(args[0], function(response) {
        response.pipe(file);
        file.on('finish', function() {
                //print("Готово")
                file.close();
        });
    });
    return "Идет скачивание!"
},{array:["URL","ustring"]})

PluginManager.add("схема список",()=>{
    return "Схемы - " + fss.readdirSync(PluginManager.variables.SchematicPath).join(",")
})
