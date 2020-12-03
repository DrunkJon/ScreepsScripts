// TODO: make sure run_new workes as intended and replace run with run_new if thats the case (watch call in main)

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
    },
    //tower_list is a list of tower-Objects
    //asumes all towers in tower_list are in the same room
    run_new: function(tower_list){
        let enemies = tower_list[0].room.find(FIND_HOSTILE_CREEPS)
        //attack script
        if(enemies.length > 0)
        {
            tower_list.forEach(tower => {
                enemies = _.sortBy(enemies, (e) => tower.pos.getRangeTo(e) )
                tower.attack(enemies[0])
            })
        } 
        //repair script
        else 
        {
            let repair_list = tower_list[0].room.find(FIND_STRUCTURES, {filter: (s) => s.hits < 35000 && s.hits < s.hitsMax /2})
            
            let tower_tasks = {}
            tower_list.forEach( tower => {
                tower_tasks[tower.id] = []
            })

            repair_list.forEach( repair => {
                close_tower = repair.pos.findClosestByRange(tower_list)
                tower_tasks[close_tower.id].push(repair)
            })

            tower_list.forEach( tower => {
                if(tower_tasks[tower.id].length > 0){
                    close_repair = repair.pos.findClosestByRange(repair_list)
                    tower.repair(close_repair)
                }
            })
        }    
    }
}

module.exports = tower