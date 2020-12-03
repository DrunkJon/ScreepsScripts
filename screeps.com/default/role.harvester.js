var w_util = require('worker.utilitys');

var roleHarvester = {

    run: function(creep) {
        var sauce = Game.getObjectById(creep.memory.sauce) 
        
	    switch(creep.memory.task){
            case 'mine':
                if(creep.store.getFreeCapacity() > 0) {
                    w_util.mine(creep, sauce)
                } else {
                    //targets are non empty storage Structures
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                    });
                    if(targets.length > 0){
                        creep.memory.task = 'store'
                        creep.say('store')
                        w_util.store(creep, targets)
                    }
                }
                break;
            case 'store':
                targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }})
                if(creep.store.getUsedCapacity() === 0 || targets.length === 0 ){
                    creep.memory.task = 'mine'
                    creep.say('mine')
                    w_util.mine(creep, sauce)
                } else {
                    w_util.store(creep, targets)
                }
                break;
        }
	}
};

module.exports = roleHarvester;