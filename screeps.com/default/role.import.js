var w_util = require('worker.utilitys')

var container_min_hits = 50000

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
                } else if(creep.memory.task != 'run' && creep.store.getUsedCapacity() > 0 && containers.length > 0 && containers[0].hits < container_min_hits){
                    creep.memory.task = 'repair'
                    w_util.repair(creep, containers[0])
                } else {
                    var constructions = creep.room.find(FIND_CONSTRUCTION_SITES)
                    if(constructions.length > 0){
                        creep.memory.task = 'build'
                        w_util.build(creep, constructions)
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
                    if(containers.length > 0){
                        var targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                        });
                        creep.memory.task = 'store'
                        w_util.store(creep, targets)
                    } else {
                        let ret_val = creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER)
                        if(ret_val === 0){
                            console.log(creep.name + ': ' + 'created a new container')
                            creep.memory.task = 'build'
                        }
                    }
                } else {
                    creep.memory.task = 'mine'
                    w_util.mine(creep, Game.getObjectById(creep.memory.sauce))
                }
                break

            case 'repair':
                if(containers.length > 0 && containers[0].hits < container_min_hits + 5000 && creep.store.getUsedCapacity() > 0){
                    creep.say('thinkies')
                    w_util.repair(creep, containers[0])
                } else {
                    creep.say('mine')
                    creep.memory.task = 'mine'
                    w_util.mine(creep)
                }
                break

            default:
                creep.memory.task = 'run'
                creep.say('default')
                break
        }
    }
}

module.exports = roleImport