module.exports = class Overlord{

    //Room
    //Spawn
    //Controller
    //Sources
    //...

    constructor(room){
        this.room = room
        this.terrain = room.getTerrain()
        this.spawn = room.find(FIND_STRUCTURES, {filter: struct => {return struct.structureType === STRUCTURE_SPAWN}})
        this.controller = room.controller
        this.sources = room.find(FIND_SOURCES)
        this.mine_find()
    }

    get_spawn(){
        return this.spawn[0]
    }

    mine_find(){
        this.source_info_objs = {}
        this.sources.forEach( source => {
            let source_acess = 0
            for(var x = source.pos.x-1; x <= source.pos.x+1; x++){
                for(var y = source.pos.y-1; y <= source.pos.y+1; y++){
                    if(this.terrain.get(x,y) === 0){
                        source_acess++
                    } 
                }
            }
            console.log('source ' + source.id + ': ' + source_acess)
            this.source_info_objs[source.id] = source_acess 
        })
    }

    get_miner_min(){
        let sum = 0
        for(var name in this.source_info_objs){
            if(this.source_info_objs[name] > 3){
                sum += 3
            } else {
                sum += this.source_info_objs[name]
            }
        }
        console.log('miner_min: ' + sum)
        return sum
    }

    spawn_miner(){
        var source_obj = {}
        this.sources.forEach(source => {
            source_obj[source.id] = 0
        })
        for(let name in Game.creeps){
            let creep = Game.creeps[name]
            if(creep.memory.role === 'harvester' && creep.room == this.room){
                source_obj[creep.memory.sauce]++
            }
        }
        for(var name in source_obj){
            var source_obj_json = JSON.stringify(source_obj)
            //console.log('source_obj: ' + source_obj_json)
            if(source_obj[name] < this.source_info_objs[name] && source_obj[name] < 3){
                var template = []
                switch(this.source_info_objs[name]){
                    case 1:
                        if(this.room.energyCapacityAvailable < 1050){
                            for(let cost = 0; cost < this.room.energyCapacityAvailable - 200; cost += 200){
                                template = template.concat([WORK,CARRY,MOVE])
                            }
                        } else {
                            template = [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,]
                        }
                        break
                    case 2:
                        if(this.room.energyCapacityAvailable < 600){
                            for(let cost = 0; cost < this.room.energyCapacityAvailable - 200; cost += 200){
                                template = template.concat([WORK,CARRY,MOVE])
                            }
                        } else {
                            template = [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,]
                        }
                        break
                    case 3:
                    default:
                        if(this.room.energyCapacityAvailable < 400){
                            for(let cost = 0; cost < this.room.energyCapacityAvailable - 200; cost += 200){
                                template = template.concat([WORK,CARRY,MOVE])
                            }
                        } else {
                            template = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,]
                        }
                        break 
                }
                let ret_val = this.get_spawn().spawnCreep(template, ('HARVESTER' + Game.time.toString(16)), {memory:{role:'harvester', task: 'mine', sauce: name}} )
                if(ret_val === 0){
                    console.log('spawning new ' + 'harvester')
                }
            } else {
                console.log('source ' + name + ': ' + 'satisfied with ' + source_obj[name])
            }
        }
    }
};