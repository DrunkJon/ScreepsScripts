var w_util = require('worker.utilitys')

function reassign(creep, task){
    creep.say(task)
    creep.memory.task = task
}

var roleAllrounder = {
    run: function(creep){

        var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            })

        var constructions = creep.room.find(FIND_CONSTRUCTION_SITES)

        var containers = creep.room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) && (s.store.getUsedCapacity() > 0)})

        switch(creep.memory.task){
            case 'haul':
            case 'mine':
                if(creep.store.getFreeCapacity() > 0){
                    if(containers.length > 0){
                        reassign(creep, 'haul')
                    } else {
                        reassign(creep, 'mine')
                    }
                } else {
                    if(targets.length > 0){
                        reassign(creep, 'store')
                    } else if( constructions.length > 0){
                        reassign(creep, 'build')
                    } else {
                        reassign(creep, 'upgrade')
                    }
                }
                break
            case 'store':
            case 'build':
            case 'upgrade':
                if(creep.store.getUsedCapacity() > 0){
                    if(targets.length > 0){
                        reassign(creep, 'store')
                    } else if( constructions.length > 0){
                        reassign(creep, 'build')
                    } else {
                        reassign(creep, 'upgrade')
                    }
                } else {
                    if(containers.length > 0){
                        reassign(creep, 'haul')
                    } else {
                        reassign(creep, 'mine')
                    }
                }
                break
            default:
                reassign(creep, 'haul')
                break
        }

        // actually do the work
        switch(creep.memory.task){
            case 'mine':
                w_util.mine(creep, Game.getObjectById(creep.memory.sauce))
                break
            case 'store':
                w_util.prio_store(creep, targets)
                break
            case 'build':
                w_util.build(creep, constructions)
                break
            case 'upgrade':
                w_util.upgrade(creep)
                break
            case 'haul':
                w_util.haul(creep, containers)
                break
        }
    }
}

module.exports = roleAllrounder