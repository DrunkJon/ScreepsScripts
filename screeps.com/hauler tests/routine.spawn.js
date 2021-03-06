//currently using: cheap_harvester, hauler, upgrader, runner
var big_harvester_template = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE]
var harvester_template = [WORK,WORK,CARRY,CARRY,MOVE,MOVE]
//var hauler_template = [WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
var hauler_template = [WORK,CARRY,CARRY,MOVE,MOVE]
var upgrader_template = [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE]
var import_harvester_template = [WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE]
var import_runner_template = [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
var warrior_template = [TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
var jesus_template = [WORK,CARRY,MOVE]
var reboot_template = [WORK,CARRY,MOVE,MOVE]

// these determine how many of each role get spawned
var harvester_min = 4
var harvesters_on_1 = 3
var hauler_min = 5
var upgrader_min = 5
var import_harvester_min = 0
var import_runner_min = 0
var warrior_min = 0
var warriors_on_1 = 0
var jesus_min = 4



var barrack1 = 'BARRACKS 1'
var barrack2 = 'BARRACKS 2'

var routineSpawn = function(spawn, creep_catalog, overlord){

    var harvester_min = overlord.get_miner_min()

    var sources = spawn.room.find(FIND_SOURCES)
    if(sources.length > 0){
        var sauce1 = sources[0].id
        if(sources.length > 1){
            var sauce2 = sources[1].id
        }
    }  
    var import_sauce = '5bbcac459099fc012e635337'

    var yall_need_jesus = true

    for(name in creep_catalog){
        if((name != 'allrounder' || name != 'haul') && creep_catalog[name].length > 0){
            yall_need_jesus = false
            break
        }
    }

    // TODO: move code for spawning into role modules
    if(yall_need_jesus && creep_catalog.allrounder.length < jesus_min){
        new_name = 'JESUS ' + Game.time.toString(16)
        var ret_val = spawn.spawnCreep(jesus_template, new_name, 
            {memory: {role: 'allrounder', task: 'mine', sauce: sauce1}})
        if(ret_val === 0){
            console.log('spawning new ' + 'jesus')
        }
    } else if(creep_catalog.harvester.length < harvester_min) {
        overlord.spawn_miner()

    } else if(creep_catalog.hauler.length < hauler_min) {
        var new_name = 'HAULER' + Game.time.toString(16)
        var ret_val = spawn.spawnCreep(hauler_template, new_name, 
            {memory: {role: 'hauler', task:'haul'}}) 
        if(ret_val === 0){
            console.log('spawning new ' + 'hauler')
        }    

    } else if(creep_catalog.import_harvester.length < import_harvester_min) {
        var new_name = 'I_HARVESTER' + Game.time.toString(16)
        var ret_val = spawn.spawnCreep(import_harvester_template, new_name, 
            {memory: {role: 'import_harvester', task: 'run', sauce: import_sauce}})
        if(ret_val === 0){
            console.log('spawning new ' + 'import harvester')
        }

    } else if(creep_catalog.import_runner.length < import_runner_min) {
        var new_name = 'I_RUNNER' + Game.time.toString(16)
        var ret_val = spawn.spawnCreep(import_runner_template, new_name,
            {memory: {role: 'import_runner', task: 'run', flag: 'Flag1'}})
        if(ret_val === 0){
            console.log('spawning new ' + 'import runner')
        }

    } else if(creep_catalog.upgrader.length < upgrader_min) {
        var new_name = 'UPGRADER' + Game.time.toString(16)
        var ret_val = spawn.spawnCreep(upgrader_template, new_name,
            {memory: {role: 'upgrader', task: 'haul'}})
        if(ret_val === 0){
            console.log('spawning new ' + 'upgrader')
        }
    
    } else if(creep_catalog.warrior.length < warrior_min) {
        var einser = _.filter(creep_catalog.warrior, (creep) => creep.memory.barrack === barrack1)
        var new_barrack = (einser.length < warriors_on_1)? barrack1 : barrack2
        var new_name = 'WARRIOR' + Game.time.toString(16)
        var ret_val = spawn.spawnCreep(warrior_template, new_name, 
            {memory: {role: 'warrior', barrack: new_barrack}})
        if(ret_val === 0){
            console.log('spawning new ' + 'warrior')
        }
    }
}

module.exports = routineSpawn