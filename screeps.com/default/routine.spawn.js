var import_overlord = require('overlord.import')


//currently using: cheap_harvester, hauler, upgrader, runner
var big_harvester_template = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE]
var harvester_template = [WORK,WORK,CARRY,CARRY,MOVE,MOVE]
var hauler_template = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK]
var upgrader_template = [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE]
var import_harvester_template = [WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE]
var import_runner_template = [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
var warrior_template = [TOUGH,TOUGH,TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
var jesus_template = [CARRY,CARRY,MOVE,MOVE]
var reboot_template = [WORK,CARRY,MOVE,MOVE]

// these determine how many of each role get spawned
var harvester_min = 6
var harvesters_on_1 = 3
var hauler_min = 6
var upgrader_min = 3
var import_harvester_min = 1
var import_runner_min = 3
var warrior_min = 3
var warriors_on_1 = 1

var import_struct = {
    IMPORT1: {
        flag: 'Flag1',
        spawn: 'Spawn1',
        runner_count: 3
    },
    IMPORT2: {
        flag: 'IMPORT2',
        spawn: 'Spawn1',
        runner_count: 3
    },
    IMPORT3: {
        flag: 'IMPORT3',
        spawn: 'Spawn1',
        runner_count: 4
    }
}

var sauce1 = '5bbcac459099fc012e63533c'
var sauce2 = '5bbcac459099fc012e63533a'
var import_sauce = '5bbcac459099fc012e635337'

var barrack1 = 'BARRACKS 1'
var barrack2 = 'BARRACKS 2'


var routineSpawn = function(spawn, creep_catalog){

    for(name in creep_catalog){
        if(name != 'allrounder' && creep_catalog[name].length > 0){
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

    } else if(creep_catalog.import_harvester.length < import_harvester_min && false) {
        var new_name = 'I_HARVESTER' + Game.time.toString(16)
        var ret_val = spawn.spawnCreep(import_harvester_template, new_name, 
            {memory: {role: 'import_harvester', task: 'run', sauce: import_sauce}})
        if(ret_val === 0){
            console.log('spawning new ' + 'import harvester')
        }

    } else if(creep_catalog.import_runner.length < import_runner_min && false) {
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
    } else {
        for(var name in import_struct){
            try{
                let import_spawn_lord = new import_overlord(import_struct[name].flag, import_struct[name].spawn, import_struct[name].runner_count)
                if(import_spawn_lord.spawn_creep(import_harvester_template, import_runner_template) == 0){
                    console.log('spawning new import creep')
                }
            } catch(err){
                console.log('!import overlord error: ' + name + '\n' + err)
            }
        }
    }
}

module.exports = routineSpawn