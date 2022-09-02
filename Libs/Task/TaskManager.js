class TaskManager{
    /**
     * @type {[Function]}
     */
    actions = []
    constructor(){

    }
    addAction(funct){
        this.actions.push(funct)
        if(this.actions.length == 1) this.run()
        return funct
    }
    pushAction(funct){
        this.actions.unshift(funct)
        if(this.actions.length ==1) this.run()
        return funct
    }
    removeActionByIndex(index){
        return this.actions.splice(index,1)
    }
    removeAction(func){
        return this.actions.splice(this.actions.indexOf(func),1)
    }
    removeAllActions(){
        this.actions = []
    }
    
    async run(){
        let attempt = 0
        while(this.actions.length > 0){
            try{
                let action = this.actions[0]
                //console.log(this.actions.length,attempt)
                await action()
                this.removeActionByIndex(0)
            }catch(e){
                console.log(e)
                attempt++
                if(attempt > 2) {
                    attempt = 0
                    this.removeActionByIndex(0)
                }
            }
        }
    }
}
module.exports = TaskManager