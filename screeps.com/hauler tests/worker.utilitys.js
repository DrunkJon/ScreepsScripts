var worker_utils = {
    mine: function(creep, source){
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffff00'}});
        }
    },
    
    store: function(creep, targets){
        targets = _.sortBy(targets, t => creep.pos.getRangeTo(t))
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ff00ff'}});
        }
    },

    prio_store: function(creep, targets){
        targets = _.sortBy(targets, t => creep.pos.getRangeTo(t) * ((t.structureType == STRUCTURE_EXTENSION)? 1 : (t.structureType == STRUCTURE_SPAWN)? 10 : (t.structureType == STRUCTURE_STORAGE)? 100 : 1000) )
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ff00ff'}});
        }
    },
    
    build: function(creep, targets){
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length) {
            if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#00ffff'}});
            }
        }
    },
    
    upgrade: function(creep){
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },
    
    repair: function(creep, target){
        if(creep.repair(target) === ERR_NOT_IN_RANGE){
            creep.moveTo(target)
        }
    },

    haul: function(creep, targets){
        targets = _.sortBy(targets, (t) => creep.pos.getRangeTo(t) / (t.store.getUsedCapacity() / 100) )
        if(creep.withdraw(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
            creep.moveTo(targets[0])
        }
    },

    import_haul: function(creep){
        let targets = _.sortBy(creep.rom.find(FIND_STRUCTURE, {filter: (s) => s.structureType === STRUCTURE_CONATINER}), (s) => creep.getRangeTo(s))
        if(creep.withdraw(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
            creep.moveTo(targets[0])
        }
    },

    single_store: function(creep, target){
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00ff'}});
        }
    },

    single_build: function(creep, target){
        if(creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#00ffff'}});
        }
    },

    single_haul: function(creep, target){
        if(creep.withdraw(target) === ERR_NOT_IN_RANGE){
            creep.moveTo(target, {visualizePathStyle: {stroke: '#3333ff'}})
        }
    },
    
    fuel_tower: function(creep){
        var targets = creep.room.find(FIND_STRUCTURES, {filter: (t) => t.structureType == STRUCTURE_TOWER})
        targets = _.sortBy(targets, (t) => creep.pos.getRangeTo(t) )
        if(creep.withdraw(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
            creep.moveTo(targets[0])
        }
    }
};

module.exports = worker_utils;