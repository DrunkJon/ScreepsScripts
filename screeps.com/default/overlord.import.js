module.exports = class ImportOverlord{

    // flag_name: name of a flag placed in the room to be imported from
    // spawn_name: name of the spawn to deliver ressources to
    constructor(flag_name, spawn_name, runner_max){
        this.flag = Game.flags[flag_name]
        this.spawn = Game.spawns[spawn_name]
        this.target_room = this.flag.room
        this.home_room = this.spawn.room
        this.runner_max = runner_max
        //console.log('_______________________________________________________________')
        //console.log('flag: ' + this.flag)
        //console.log('spawn: ' + this.spawn)
        //console.log('target_room: ' + this.target_room)
        //console.log('home_room: ' + this.home_room)
        //console.log('runner_max: ' + this.runner_max)
    }

    find_sources(){
        // inits this.sources if it does not exist already
        if(typeof this.target_room != 'undefined' && typeof this.sources === 'undefined'){
            this.sources = this.target_room.find(FIND_SOURCES)
        }
    }

    find_creeps(){
        // inits this.creeps if it does not exist already
        this.find_sources()
        if(typeof this.sources != 'undefined' && typeof this.creeps === 'undefined'){
            this.creeps = {harvesters: [], runners: [], scouts: [], warrior: []}
            for(let name in Game.creeps){
                let creep = Game.creeps[name]
                switch(creep.memory.role){
                    case 'import_harvester':
                        if(this.sources.includes(Game.getObjectById(creep.memory.sauce)) && creep.ticksToLive > 200){
                            this.creeps.harvesters.push(creep)
                        }
                        break
                    case 'import_runner':
                        if(creep.memory.flag === this.flag.name){
                            this.creeps.runners.push(creep)
                        }
                        break
                    case 'scout':
                        if(creep.memory.flag === this.flag.name){
                            this.creeps.scouts.push(creep)
                        }
                        break
                }
            }
        } else if(typeof this.target_room === 'undefined' && typeof this.creeps === 'undefined'){
            this.creeps = {harvester: [], runners: [], scouts: []}
            for(var name in Game.creeps){
                let creep = Game.creeps[name]
                if(creep.memory.role === 'scout' && creep.memory.flag === this.flag.name ){
                    this.creeps.scouts.push(creep)
                }
            } 
        } else {
            console.log('find_sources had an error target_room is defined')
        }
    }

    // spawn_creep creates a lot of overhead, there should be a simpler way for checking if a spawn is needed

    spawn_creep(harvester_template, runner_template){
        // returns 1 if this room does not need a creep spawned
        // else returns spawnCreep() return value

        this.find_creeps()
        
        if(typeof this.target_room === 'undefined' && this.creeps.scouts.length === 0){
            let ret_val =  this.spawn.spawnCreep([MOVE], this.flag.name + '-SCOUT' + Game.time.toString(16), {memory: {role: 'scout', flag: this.flag.name}})
            console.log('scout ret: ' + ret_val)
            return ret_val
        } 
        else if(typeof this.creeps != 'undefined'){
            let mined_source_ids = []
            if(this.creeps.harvesters != undefined){
                this.creeps.harvesters.forEach(creep => {
                    if(!mined_source_ids.includes(creep.memory.sauce)){
                        mined_source_ids.push(creep.memory.sauce)
                    }
                })
            } else {
                console.log('I harvesters undefined!')
            }
            console.log('mined_source_ids: ' + mined_source_ids + ' length: ' + mined_source_ids.length )
    
            this.sources.forEach( source => {
                let id = source.id
                if(!mined_source_ids.includes(id)){
                    let ret_val = this.spawn.spawnCreep(harvester_template, 'I_HARVESTER' + Game.time.toString(16), {memory: {role: 'import_harvester', task: 'run', sauce: id, flag: this.flag.name, spawn: this.spawn.id}})
                    console.log('harvester ret: ' + ret_val)
                    return ret_val 
                } else {
                    console.log('no need for miners')
                }
            })
    
            // only create runners if room  has a container
            if(this.target_room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_CONTAINER}).length > 0){
                if(this.creeps.runners.length < Math.min(3* this.sources.length, this.runner_max)){
                    var ret_val = this.spawn.spawnCreep(runner_template, 'I_RUNNER' + Game.time.toString(16), {memory: {role: 'import_runner', task: 'run', flag: this.flag.name, spawn: this.spawn.id}})
                    console.log('runner ret: ' + ret_val)
                    return ret_val
                }
            } else {
                console.log('no need for runners')
            }
        } else {
            console.log('?')
        }

        // no creep needed to be spawned
        return 1
    }
}