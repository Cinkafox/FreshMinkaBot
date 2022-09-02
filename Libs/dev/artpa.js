const PluginManager = require("../PluginManager")
/**
 * @type {import("mineflayer").Bot}
 */
const bot = PluginManager.variables.bot
const { Lang, print } = PluginManager

const mcData = require('minecraft-data')("1.13.2");
const Item = require('prismarine-item')("1.13.2");
const nbt = require('prismarine-nbt');
const path = require('path');
const PNGImage = require('pngjs-image');
const normalizedPath = path.join(__dirname, "../map");
const getColor = require("../Libs/Map/mapcolor");

let nbtq = (id)=>{
	return nbt.comp({
		map:nbt.int(id)
	})
}

let equip = async (id, bot) => {
	await bot.creative.clearInventory();
	let item = new Item(mcData.itemsByName["filled_map"].id, 1,nbtq(id));
	await bot.creative.clearSlot(36)
	await bot.creative.setInventorySlot(36, item);
	equipBlock = bot.inventory.findInventoryItem(item.name);
	//await bot.toss(item.type,null,1)
	return equipBlock;
}

let a = async (bot,from,to)=>{
	for(let i = from;i<=to;i++){
			
			const e = await equip(i,bot);
			await bot.equip(e, "hand");
			bot._client.once('map', ({ data }) => {
				
				if(!data) return;
				const size = Math.sqrt(data.length);
				const image = PNGImage.createImage(size, size);
			
				console.log(`Map size is ${size}x${size}`)
			
				for(let x = 0; x < size; x++) {
					for(let z = 0; z < size; z++) {
						const colorId = data[x + (z * size)];
						image.setAt(x, z, getColor(colorId));
			
					}
				}
			
				image.writeImage(normalizedPath + `/id` + i +`.png`, function (err) {
					if (err) throw err;
					console.log('Written to the file');
				});
			
			});
			
	}
}
PluginManager.add("карты",(args)=>{
	bot.chat("/gamemode creative")
	setTimeout(()=>{
		a(bot,args[0],args[1]);
	},100)
	
},{array:["number","number"]});
