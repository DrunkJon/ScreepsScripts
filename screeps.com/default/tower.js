var tower = {
    run: function(tower){
        var enemies = tower.room.find(FIND_HOSTILE_CREEPS)
        if(enemies.length > 0){
            enemies = _.sortBy(enemies, (e) => tower.pos.getRangeTo(e) )
            tower.attack(enemies[0])
        } else {
            var structs = tower.room.find(FIND_STRUCTURES, {filter: (s) => (s.hits < 30000) && (s.hits < s.hitsMax / 2)})
            structs = _.sortBy(structs, (s) => tower.pos.getRangeTo(s))
            tower.repair(structs[0])
        }
    }
}

module.exports = tower