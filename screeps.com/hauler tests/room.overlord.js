module.exports = class Overlord{

    //Room
    //Spawn
    //Controller
    //Sources
    //...

    constructor(room){
        this.room = room
        this.spawn = room.find(FIND_STRUCTURES, {filter: struct => {return struct.structureType === STRUCTURE_SPAWN}})
        this.controller = room.
    }
};