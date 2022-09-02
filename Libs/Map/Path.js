const { Vec3 } = require("vec3")
class Path{
    funcGet
    constructor(funcGet){
        this.funcGet = funcGet
    }

    DIST = 20
    len
    WALL = -1
    BLANK = -2
    grid = []
    px = []
    py = []
    getPoint(x,y){
        if(!this.grid[y]) return this.funcGet(x,y)
        if(this.grid[y][x] == undefined) return this.funcGet(x,y)
        return this.grid[y][x]
    }

    setPoint(x,y,d){
        if(!this.grid[y]) this.grid[y] = []
        this.grid[y][x] = d
    }
    findPath(from,to){
        return this.lee(Math.floor(from.x),Math.floor(from.z),Math.floor(to.x),Math.floor(to.z))
    }
    lee(ax, ay, bx, by) {
        let dx = [1, 0, -1, 0]
        let dy = [0, 1, 0, -1]
        let d, x, y, k
        let stop
        if (this.getPoint(ax,ay) == this.WALL || this.getPoint(bx,by) == this.WALL) return false
    
        d = 0
        this.setPoint(ax,ay,0)
        do {
            stop = true
            for (y = ay-this.DIST; y < ay+this.DIST; y++)
                for (x = ax-this.DIST; x < ax+this.DIST; x++) 
                    if ( this.getPoint(x,y) == d ){
                    for (k = 0; k < 4; k++) {
                        let iy = y + dy[k], ix = x + dx[k]
                        let po = this.getPoint(ix,iy)
                        if (po == this.BLANK) {
                            stop = false
                            this.setPoint(ix,iy,d+1)
                        }
                    }
                }
            d++
        } while (!stop && this.getPoint(bx,by) == this.BLANK)
    
        if (this.getPoint(bx,by) == this.BLANK) return false;
    
        this.len = this.grid[by][bx];
        x = bx
        y = by
        d = this.len
        while (d > 0) {
            this.px[d] = x
            this.py[d] = y
            d--
            for (k = 0; k < 4; k++) {
                let iy = y + dy[k], ix = x + dx[k];
                if (this.getPoint(ix,iy) == d) {
                    x = x + dx[k]
                    y = y + dy[k]
                    break
                }
            }
        }
        this.px[0] = ax
        this.py[0] = ay
        return true  
    }
    async go(func){
        for (let i = 0; i < this.px.length; i++) {
            await func(this.px[i],this.py[i])
        }
    }
}
module.exports = Path
module.exports.WALL = -1
module.exports.BLANK = -2