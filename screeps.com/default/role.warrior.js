var roleWarrior = {
    run_all: function(creeps){
        // maybe if I have more structure
    },

    bodyguard: function(creep){
        var barrack = Game.flags[creep.memory.barrack]
        var my_room = Game.flags[creep.memory.barrack].room

        if(creep.room != my_room){
            creep.moveTo(barrack)
        } else {
            var enemies = creep.room.find(FIND_HOSTILE_CREEPS)
            if(enemies.length > 0){
                enemies = _.sortBy(enemies, (e) => tower.pos.getRangeTo(e) )
                if(creep.attack(enemies[0]) === ERR_NOT_IN_RANGE){
                    creep.moveTo(enemies[0])
                }
            } else {
                creep.moveTo(barrack)
            }
        }
    }
}

module.exports = roleWarrior