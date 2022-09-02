const { Vec3 } = require("vec3")
const Path = require("./Map/Path")

class MicroUtilites{
  /**
  * @type {import("mineflayer").Bot}
  */
    bot
    mcData
    Item
    constructor(bot){
        this.bot = bot
        this.mcData = require('minecraft-data')(bot.version)
        this.Item = require('prismarine-item')(bot.version)
    }
    wait (ms) { return new Promise(resolve => setTimeout(resolve, ms)) }
    async equipItem (id) {
        if (this.bot.inventory.items().length > 30) {
          await this.bot.creative.clearInventory()
        }
        if (!this.bot.inventory.items().find(x => x.type === id)) {
          const slot = this.bot.inventory.firstEmptyInventorySlot()
          await this.bot.creative.setInventorySlot(slot !== null ? slot : 36, new (this.Item)(id, 1))
        }
        const item = this.bot.inventory.items().find(x => x.type === id)
        await this.bot.equip(item, 'hand')
      }
    /**
     * Летим в пизду по координатам
     * @param {Vec3} pos 
     */
    async flyto(to){
        await this.bot.creative.flyTo(new Vec3(to.x,to.y,to.z))
    }

    async createPath(to,func){
        const pos = this.bot.entity.position
        await this.bot.creative.flyTo(new Vec3(pos.x,to.y,pos.z))
        let p = new Path((x,z)=>{
          let block = this.bot.blockAt(new Vec3(x,to.y,z))
          if(!block || block.name !== "air") return Path.WALL
          let block2 = this.bot.blockAt(new Vec3(x,to.y+1,z))
          if(!block2 || block2.name !== "air") return Path.WALL
          return Path.BLANK
        })
        let o = p.findPath(pos,to)
        await p.go(func)
        return o
    }

      /**
       * ставить блоки
       * @param {Number} id 
       * @param {Vec3} pos 
       * @param {Vec3} face 
       */
    async placeBlock(id,pos,face,fl = 'ignore'){
        console.log(id,pos)
        if(id === 0){
          await this.bot.dig(this.bot.blockAt(pos))
          return
        }
        await this.equipItem(id)
        await this.bot._placeBlockWithOptions(this.bot.blockAt(pos.minus(face)),face,{ swingArm: 'right' , forceLook:fl})
    }
        /**
       * ставить блоки
       * @param {Number} id 
       * @param {Vec3} pos 
       * @param {Vec3} face 
       */
    async goAndPlace(id,pos,face,fl = 'ignore'){
        const to = pos.floor().plus(face)
        await this.flyto(to.offset(0.5,0,0.5))
        await this.placeBlock(id,pos,face,fl)
    }
}
module.exports = MicroUtilites