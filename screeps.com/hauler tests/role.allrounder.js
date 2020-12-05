var w_util = require('worker.utilitys')

var roleAllrounder = {
    run: function(creep){

        var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            })

        switch(creep.memory.task){
            case 'mine':
                if(creep.store.getFreeCapacity() > 0){
                    w_util.mine(creep, Game.getObjectById('5bbcac459099fc012e63533c'))
                } else {
                    creep.say('store')
                    creep.memory.task = 'store'
                    w_util.prio_store(creep, targets)
                }
                break
            case 'store':
                if(creep.store.getUsedCapacity() > 0){
                    w_util.prio_store(creep, targets)
                } else {
                    creep.say('mine')
                    creep.memory.task = 'mine'
                    w_util.mine(creep, Game.getObjectById('5bbcac459099fc012e63533c'))
                }
                break
            default:
                creep.memory.task = 'mine'
                break
        }
    }
}

module.exports = roleAllrounder