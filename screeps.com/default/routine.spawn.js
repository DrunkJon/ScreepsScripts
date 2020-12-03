//currently using: cheap_harvester, hauler, upgrader, runner
var big_harvester_template = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE]
var harvester_template = [WORK,WORK,CARRY,CARRY,MOVE,MOVE]
var hauler_template = [WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
var upgrader_template = [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE]
var import_harvester_template = [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]
var import_runner_template = [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
var warrior_template = [TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
var jesus_template = [CARRY,CARRY,MOVE,MOVE]
var reboot_template = [WORK,CARRY,MOVE,MOVE]

// these determine how many of each role get spawned
var harvester_min = 6
var harvesters_on_1 = 3
var upgrader_min = 3
var hauler_min = 4
var import_harvester_min = 1
var import_runner_min = 2
var warrior_min = 2
var warriors_on_1 = 1

var sauce1 = '5bbcac459099fc012e63533c'
var sauce2 = '5bbcac459099fc012e63533a'
var import_sauce = '5bbcac459099fc012e635337'

var barrack1 = 'BARRACKS 1'
var barrack2 = 'BARRACKS 2'

var routineSpawn = function(spawn, creep_catalog){

    // TODO: move code for spawning into role modules
    // TODO: create code for rebooting room after collapse 
    if(creep_catalog.harvester.length < harvester_min) {
        var einser = _.filter(creep_catalog.harvester, (creep) => creep.memory.sauce === sauce1)
        var new_sauce = (einser.length < harvesters_on_1)? sauce1 : sauce2
        var new_name = 'HARVESTER' + Game.time.toString(16)
        var ret_val = spawn.spawnCreep(harvester_template, new_name, 
            {memory: {role: 'harvester', task: 'mine', sauce: new_sauce}})
        if(ret_val === 0){
            console.log('spawning new ' + 'harvester')
        }

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
            {memory: {role: 'import_runner', task: 'run'}})
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