var w_util = require('worker.utilitys')

var roleRunner = {
    run: function(creep){
        
        switch(creep.memory.task){
            case 'run':
                if(creep.room != Game.flags['Flag1'].room ){
                    creep.moveTo(Game.flags['Flag1'])
                } else {
                    if(creep.store.getFreeCapacity() > 0){
                        w_util.mine(creep, Game.getObjectById('5bbcac459099fc012e635337'))
                    } else {
                        creep.memory.task = 'return'
                    }
                }
                break;
            case 'return':
                if(creep.room != Game.getObjectById('5fc51cb068cc387a2256d7c3').room ){
                    creep.moveTo(Game.getObjectById('5fc51cb068cc387a2256d7c3'))
                } else {
                    if(creep.store.getUsedCapacity() > 0){
                        w_util.store(creep, [Game.getObjectById('5fc51cb068cc387a2256d7c3')])
                    } else {
                        creep.memory.worth += creep.store.getCapacity()
                        creep.memory.task = 'run'
                    }
                }
                break;
        }
    }
}

module.exports = roleRunner