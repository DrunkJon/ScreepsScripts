var w_util = require('worker.utilitys')

var roleUpgrader = {

    run: function(creep) {

        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
            }
        });

        switch(creep.memory.task){
            case 'haul':
                if(creep.store.getFreeCapacity() > 0){
                    w_util.haul(creep, containers)
                } else {
                    creep.memory.task = 'upgrade'
                    creep.say('upgrade')
                    w_util.upgrade(creep)
                }
                break;
            case 'upgrade':
                if(creep.store[RESOURCE_ENERGY] > 0){
                    w_util.upgrade(creep)
                } else {
                    creep.memory.task = 'haul'
                    creep.say('haul')
                    w_util.haul(creep, containers)
                }
                break;
        }
	}
};

module.exports = roleUpgrader;