/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.defender');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(creep) {
        var targets = creep.room.find(FIND_HOSTILE_CREEPS);
        
		if (targets.length >0) {
		    if(creep.attack(targets[0]) === ERR_NOT_IN_RANGE) {
		        creep.moveTo(targets[0]);
		    } else {
		        creep.attack(targets[0]);
		    }
			
			
		} else {
		    if(Game.flags.defenderSpawn !== undefined){
		        creep.moveTo(Game.flags.defenderSpawn);
		    }
		}
    }
};
