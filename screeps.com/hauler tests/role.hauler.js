var w_util = require('worker.utilitys')

function reassign(creep, task, busy_val){
    creep.say(task)
    creep.memory.task = task
    creep.memory.busy = busy_val
}

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

    },

    run_new: function(creeps, verbose = false){
        let room = creeps[0].room
        let constructions = room.find(FIND_CONSTRUCTION_SITES)

        let struct_catalog = {}
        struct_catalog[STRUCTURE_SPAWN] = []
        struct_catalog[STRUCTURE_EXTENSION] = []
        struct_catalog[STRUCTURE_CONTAINER] = []
        struct_catalog[STRUCTURE_STORAGE] = []
        struct_catalog[STRUCTURE_TOWER] = []
        struct_catalog[STRUCTURE_LINK] = []

        room.find(FIND_STRUCTURES).forEach( struct => {
            if(struct.structureType in struct_catalog){
                switch(struct.structureType){
                    case STRUCTURE_CONTAINER:
                        if(struct.store.getUsedCapacity() > 0){
                            struct_catalog[STRUCTURE_CONTAINER].push(struct)
                        }
                        break
                    case STRUCTURE_LINK:
                        // I dunno what im gonna do with this thing
                        break
                    default:
                        if(struct.store.getFreeCapacity() > 0 || struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0){
                            struct_catalog[struct.structureType].push(struct)
                        }
                        break
                }
            }
        })

        
        let tombs = room.find(FIND_TOMBSTONES, {filer: (t) => t.store.getUsedCapacity() > 0})
        let valid_tombs = []
        tombs.forEach( tomb => {
            if(tomb.store.getUsedCapacity() > 0){
                valid_tombs.push(tomb)
                console.log(tomb.id + ': ' + tomb.store.getUsedCapacity())  
            } 
        })
        let valid_ruins = room.find(FIND_RUINS, {filter: (r) => r.store.getUsedCapacity() > 0})
        let drops = room.find(FIND_DROPPED_RESOURCES)

        //console.log('valid tombs: ' + valid_tombs.length)
        //console.log('valid ruins: ' + valid_ruins.length)
        //console.log('valid drops: ' + drops.length)


        let haulable = struct_catalog[STRUCTURE_CONTAINER].concat(valid_tombs)
        let storeable = struct_catalog[STRUCTURE_SPAWN].concat(struct_catalog[STRUCTURE_EXTENSION], struct_catalog[STRUCTURE_TOWER])


        function haul_prio_closure(creep){
            function haul_prio(struct){
                return creep.pos.getRangeTo(struct) * ( 1 + struct.store.getFreeCapacity() / 125 )
            }
            return haul_prio
        }

        function store_prio_closure(creep){
            function store_prio(struct){
                return creep.pos.getRangeTo(struct) * ( ([STRUCTURE_SPAWN, STRUCTURE_EXTENSION].includes(struct.structureType))? 1 : (struct.structureType === STRUCTURE_TOWER)? 10 : 100 )
            }
            return store_prio
        }

        function exists_and_in(id, obj_list){
            let obj = Game.getObjectById(id) 
            return ((obj != null) && (obj_list.includes(obj)))? true : false
        }



        let busy_creeps = []
        let idle_creeps = []
        creeps.forEach(creep => {
            if(creep.memory.busy){
                switch(creep.memory.task){
                    case 'store':
                        if((creep.store.getUsedCapacity() === 0) || !exists_and_in(creep.memory.target, storeable.concat(struct_catalog[STRUCTURE_STORAGE]))){
                            creep.memory.busy = false
                            idle_creeps.push(creep)
                            creep.say('store idle')
                        } else {
                            busy_creeps.push(creep)
                        }
                        break
                    case 'build':
                        if(creep.store.getUsedCapacity() === 0 || !exists_and_in(creep.memory.target, constructions)){
                            creep.memory.busy = false
                            idle_creeps.push(creep)
                            creep.say('build idle')
                        } else {
                            busy_creeps.push(creep)
                        }
                        break
                    case 'haul':
                        if(creep.store.getFreeCapacity() === 0 || !exists_and_in(creep.memory.target, haulable)){
                            creep.memory.busy = false
                            idle_creeps.push(creep)
                            creep.say('haul idle')
                        } else {
                            busy_creeps.push(creep)
                        }
                        break
                    default:
                        console.log('overwrote busy creep for not having task')
                        creep.memory.busy = false
                        idle_creeps.push(creep)
                        break
                }
                busy_creeps.push(creep)
            } else {
                idle_creeps.push(creep)
            }
        })


        let creep_targets = []
        creeps.forEach( creep => {
            creep_targets.push(Game.getObjectById(creep.memory.target))
        })

        storeable = _.filter(storeable, (s) => !creep_targets.includes(s))

        idle_creeps.forEach(creep => {
            if(creep.store.getUsedCapacity() > creep.store.getCapacity() * 0.1 || creep.store.getUsedCapacity() - creep.store.getUsedCapacity(RESOURCE_ENERGY) != 0)
            {   //store / build
                if(creep.store.getUsedCapacity() - creep.store.getUsedCapacity(RESOURCE_ENERGY) != 0 && struct_catalog[STRUCTURE_STORAGE].length > 0){
                    creep.memory.target = creep.pos.findClosestByRange(struct_catalog[STRUCTURE_STORAGE]).id
                    creep.memory.busy = true
                    creep.memory.task = 'store'
                    busy_creeps.push(creep)
                } else if(storeable.length > 0){ //prio storage
                    let this_store_prio = store_prio_closure(creep)
                    storeable = _.sortBy(storeable, (s) => this_store_prio(s))
                    creep.memory.target = storeable.shift().id
                    creep.memory.task = 'store'
                    creep.memory.busy = true
                    busy_creeps.push(creep)
                } else if(constructions.length > 0){ //construction
                    creep.memory.target = constructions[0].id
                    creep.memory.task = 'build'
                    creep.memory.busy = true
                    busy_creeps.push(creep)
                } else if(struct_catalog[STRUCTURE_STORAGE].length > 0){ //low prio storage
                    creep.memory.target = creep.pos.findClosestByRange(struct_catalog[STRUCTURE_STORAGE]).id
                    creep.memory.task = 'store'
                    creep.memory.busy = true
                    busy_creeps.push(creep)
                } else {
                    creep.say('cant store!!')
                }

            } else 
            {   //haul
                if(haulable.length > 0){
                    let this_haul_prio = haul_prio_closure(creep)
                    haulable = _.sortBy(haulable, (s) =>  this_haul_prio(s))
                    creep.memory.task = 'haul'
                    creep.memory.busy = true
                    busy_creeps.push(creep)
                    creep.memory.target = haulable[0].id
                } else {
                    creep.say('cant haul!!')
                }
            }
        })



        busy_creeps.forEach(creep => {
            switch(creep.memory.task){
                case 'store':
                    w_util.single_store(creep, Game.getObjectById(creep.memory.target))
                    break
                case 'build':
                    w_util.single_build(creep, Game.getObjectById(creep.memory.target))
                    break
                case 'haul':
                    w_util.single_haul(creep, Game.getObjectById(creep.memory.target))
                    break
                case 'defaul':
                    console.log('busy hauler had default task')
                    creep.say('deault')
                    break
            }
        })


        if(creeps.length > busy_creeps.length){
            console.log(creeps.length - busy_creeps.length + ' idle haulers!')
        }
        if(verbose){
            console.log('_______________NEW___TICK_______________')

            function haul_status(creep){
                if(creep.memory.task != 'build'){
                    let cap_percent = Math.ceil(Game.getObjectById(creep.memory.target).store.getUsedCapacity(RESOURCE_ENERGY) / Game.getObjectById(creep.memory.target).store.getCapacity(RESOURCE_ENERGY) * 100)
                    console.log(creep.name + ': ' + creep.memory.task + ' ' + Game.getObjectById(creep.memory.target).structureType + ' ' + cap_percent + '%')  
                } else {
                    let prog_percent = Math.ceil(Game.getObjectById(creep.memory.target).progress / Game.getObjectById(creep.memory.target).progressTotal *100)
                    console.log(creep.name + ': ' + creep.memory.task + ' ' + Game.getObjectById(creep.memory.target).structureType + ' ' + prog_percent + '%')
                }
            }

            creeps.forEach(creep => {
                haul_status(creep)
            })
        }
    }
};

module.exports = roleHauler;