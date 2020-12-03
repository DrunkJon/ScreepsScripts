var roleHarvester = require('role.harvester')
var roleUpgrader = require('role.upgrader')
var roleHauler = require('role.hauler')
var roleRunner = require('role.runner')
var roleImport = require('role.import')
var roleAllrounder = require('role.allrounder')
var tower = require('tower')
var spawn_routine = require('routine.spawn')
var roleWarrior = require('role.warrior')
var w_util = require('worker.utilitys')

module.exports.loop = function () {
    
    //clearing dead creeps memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    //tower script
    var towers = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER})
    tower.run(Game.getObjectById('5fc55ebb7eb8ef1337291209'))

    //list of creeps organized by their role
    //remember to add new roles to this
    var creep_catalog = {
        harvester: [],
        hauler: [],
        upgrader: [],
        import_harvester: [],
        import_runner: [],
        warrior: []
    }

    // execute role code & build creep_catalog
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        //build creep_catalog
        if(creep_catalog.hasOwnProperty(creep.memory.role) && ((creep.memory.role != 'import_harvester' && creep.memory.role != 'warrior') || creep.ticksToLive > 150) ){
            creep_catalog[creep.memory.role].push(creep)
        }
        
        // TODO: make creeps regen themselves if their timeolive is low (< 200)
        
        //executes role code
        switch(creep.memory.role){
            case 'l_harvester':
            case 'harvester':
                roleHarvester.run(creep)
                break
            case 'upgrader':
                roleUpgrader.run(creep)
                break
            case 'hauler':
                roleHauler.run(creep)
                break
            case 'runner':
                roleRunner.run(creep)
                break
            case 'import_harvester':
                roleImport.harvester(creep)
                break
            case 'import_runner':
                roleImport.runner(creep)
                break
            case 'allrounder':
                roleAllrounder.run(creep)
                break
            case 'warrior':
                roleWarrior.bodyguard(creep)
                break
            default:
                roleHauler.run(creep)
                break
        }
        
    }

    //spawn script
    try{
        spawn_routine(Game.spawns['Spawn1'], creep_catalog)
    } catch {
        console.log('!spawning error!')
    }

}