var w_util = require('worker.utilitys')

var flag = Game.flags['Flag1']
// set creep.memory.sauce on spawn

var roleImport = {
    runner: function(creep){

        switch(creep.memory.task){

            case 'run':
                if(creep.room != Game.flags['Flag1'].room ){
                    creep.moveTo(Game.flags['Flag1'])
                } else {
                    if(creep.store.getFreeCapacity() > 0){
                        var containers = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        w_util.haul(creep, containers)
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
                        var containers = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                            }
                        });
                        w_util.store(creep, containers)
                    } else {
                        creep.memory.worth += creep.store.getCapacity()
                        creep.memory.task = 'run'
                    }
                }
                break;

            default:
                creep.memory.task = 'run'
                break
        }
    },

    harvester: function(creep){

        var containers = creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER})
        containers = _.sortBy(containers, (s)=> creep.pos.getRangeTo(s))
        
        switch(creep.memory.task){

            case 'run':
                if(creep.room != Game.flags['Flag1'].room){
                    creep.moveTo(Game.flags['Flag1']) 
                } else {
                    creep.memory.task = 'mine'
                    creep.say('mine')
                    w_util.mine(creep, Game.getObjectById(creep.memory.sauce))
                }
                break

            case 'mine':
                if(creep.store.getFreeCapacity() > 4){
                    w_util.mine(creep, Game.getObjectById(creep.memory.sauce))
                } else {
                    var constructions = creep.room.find(FIND_CONSTRUCTION_SITES)
                    if(constructions.length > 0){
                        creep.memory.task = 'build'
                        w_util.build(creep, constructions)
                    } else if(containers.length > 0 && containers[0].hits < 500){
                        creep.task = 'repair'
                        w_util.repair(containers[0])
                    } else {
                        creep.memory.task = 'store'
                        w_util.store(creep, containers)
                    }
                }
                break

            case 'build':
                creep.say('build')
                if(creep.store.getUsedCapacity() > 0){
                    var constructions = creep.room.find(FIND_CONSTRUCTION_SITES)
                    if(constructions.length > 0){
                        creep.memory.task = 'build'
                        w_util.build(creep, constructions)
                    } else {
                        var targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                        });
                        creep.memory.task = 'store'
                        w_util.store(creep, targets)
                    }
                } else {
                    creep.memory.task = 'mine'
                    w_util.mine(creep, Game.getObjectById(creep.memory.sauce))
                }
                break

            case 'store':
                creep.say('store')
                if(creep.store.getUsedCapacity() > 0){
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    });
                    creep.memory.task = 'store'
                    w_util.store(creep, targets)
                } else {
                    creep.memory.task = 'mine'
                    w_util.mine(creep, Game.getObjectById(creep.memory.sauce))
                }
                break

            case 'repair':
                if(containers.length > 0 && containers[0].hits < 2000 && creep.getUsedCapacity > 0){
                    w_util.repair(creep, containers[0])
                } else {
                    creep.say('mine')
                    creep.memory.task = 'mine'
                    w_util.mine(creep)
                }

            default:
                creep.memory.task = 'run'
        }
    }
}

module.exports = roleImport