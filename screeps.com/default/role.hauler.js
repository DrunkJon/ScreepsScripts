var w_util = require('worker.utilitys')

var roleHauler = {
    run: function(creep) {
        //TODO: make haulers pick up ressources from the ground and transport them to Storage
        
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER ) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
            }
        });
        // || structure.structureType == STRUCTURE_STORAGE

        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });

        switch(creep.memory.task){
            case 'haul':
                if(creep.store.getFreeCapacity() > 0){
                    w_util.haul(creep, containers)
                } else {
                    creep.memory.task = 'store'
                    creep.say('store')
                    w_util.prio_store(creep, targets)
                }
                break;
            case 'store':
                if(targets.length == 0){
                    creep.memory.task = 'build / upgrade'
                    creep.say('build / upgrade')
                    w_util.upgrade(creep)
                } else if(creep.store.getUsedCapacity() > 0){
                    w_util.prio_store(creep, targets)
                } else {
                    creep.memory.task = 'haul'
                    creep.say('haul')
                    w_util.haul(creep, containers)
                }
                break;
            case 'build / upgrade':
                if(creep.store.getUsedCapacity() > 0){
                    var constructions = creep.room.find(FIND_CONSTRUCTION_SITES);
                    if(constructions.length > 0){
                        w_util.build(creep, constructions)
                    } else {
                        var storage = creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_STORAGE && s.store.getFreeCapacity() > 0})
                        if(storage.length > 0){
                            w_util.store(creep, storage)
                        } else {
                            w_util.upgrade(creep)  
                        }
                    }
                } else {
                    creep.memory.task = 'haul'
                    creep.say('haul')
                    w_util.haul(creep, containers)
                }
                break;
        }

    }
};

module.exports = roleHauler;