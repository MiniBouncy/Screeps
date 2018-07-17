/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.repairer');
 * mod.thing == 'a thing'; // true
 */

var roleUpgrader = require('role.upgrader');

var roleRepairer = {

    run: function(creep) {
        var result;
        
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }

        else if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.say('Repairing');
            creep.memory.working = true;
        }
        

	    if(creep.memory.working) {
            var dmgStructures = _.filter(creep.room.find(FIND_STRUCTURES), (o) => o.hits < o.hitsMax && !(o.structureType === STRUCTURE_WALL || o.structureType === STRUCTURE_RAMPART)); 
            var structure = dmgStructures[0];
            
            for (s of dmgStructures) {
                if((s.hits / s.hitsMax) < (structure.hits / structure.hitsMax)) {
                    structure = s;
                }
            }
            if(structure !== undefined) {
                result = work(creep, structure);
            } else {
                roleUpgrader.run(creep);
            }
        } else {
            var sources = creep.room.find(FIND_SOURCES, {
                filter: (s) => s.energy > 0
            });
            
            var source = creep.pos.findClosestByPath(sources);
            
            if(source !== null)
                result = collect(creep, source);
        }
        creep.memory.result = result;
	}
};

module.exports = roleRepairer;

    function work(creep, target) {
        if(creep.repair(target) === ERR_NOT_IN_RANGE) {
            creep.say('Repairing');
            return creep.moveTo(target);
        } else {
            creep.say('Repairing');
            return creep.repair(target);
        }
    }

    function collect(creep, target) {
        if(!creep.pos.isNearTo(target)) {
            return creep.moveTo(target);
        } else {
            return creep.harvest(target);
        }
    }
