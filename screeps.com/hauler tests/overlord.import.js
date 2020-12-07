module.exports = class ImportOverlord{

    // flag_name: name of a flag placed in the room to be imported from
    // spawn_name: name of the spawn to deliver ressources to
    constructor(flag_name, spawn_name, runner_max){
        this.flag = Game.flags[flag_name]
        this.spawn = Game.spawns[spawn_name]
        this.target_room = this.flag.room
        this.home_room = this.spawn.room
        this.runner_max = runner_max
    }

    find_sources(){
        // inits this.sources if it does not exist already
        if(typeof this.sources === 'undefined'){
            this.sources = this.target_room.find(FIND_SOURCES)
        }
    }

    find_creeps(){
        // inits thid.creeps if it does not exist already
        this.find_sources()
        if(typeof this.creeps === 'undefined'){
            this.creeps = {harvester: [], runners: []}
            for(let name in Game.creeps){
                let creep = Game.creeps[name]
                switch(creep.memory.role){
                    case 'import_harvester':
                        if(this.sources.includes(creep.memory.sauce)){
                            this.creeps.harvesters.push(creep)
                        }
                        break
                    case 'import_runner':
                        if(creep.memory.flag === this.flag.name){
                            this.creeps.runners.push(creep)
                        }
                        break
                }
            }
        }
    }

    spawn_creep(harvester_template, runner_template){
        // returns 1 if this room does not need a creep spawned
        // else returns spawnCreep() return value
        this.find_creeps()

        let mined_source_ids = []
        this.creeps.harvesters.forEach(creep => {
            if(!mined_source_ids.includes(creep.memory.sauce)){
                mined_source_ids.push(creep.memory.sauce)
            }
        })

        this.sources.forEach( source => {
            let id = source.id
            if(!mined_source_ids.includes(id)){
                return this.spawn.spawnCreep(harvester_template, 'I_HARVESTER' + Game.time.toString(16), {memory: {role: 'import_harvester', task: 'run', sauce: id}})
            }
        })

        // only create runners if room  has a container
        if(this.room.find(FIND_STUCTURES, {filter: (s) => s.structureType === STRUCTURE_CONTAINER}).length > 0){
            if(this.creeps.runners.length < Math.min(3* this.sources.length, this.runner_max)){
                return this.spawn.spawnCreep(runner_template, 'I_RUNNER' + Game.time.toString(16), {memory: {role: 'import_runner', task: 'run', flag: this.flag.name}})
            }
        }

        // no creep needed to be spawned
        return 1
    }
}