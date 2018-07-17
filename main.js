var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var roleDefender = require('role.defender');
var roleRepairer = require('role.repairer');
var tower = require('tower');


module.exports.loop = function () {
    for(var name in Memory.creeps) {
        if(Game.creeps[name] == undefined)
            delete Memory.creeps[name];
    }
    
     for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(!creep.spawning) {
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role == 'repairer') {
                roleRepairer.run(creep);
            }
            if(creep.memory.role == 'defender') {
                roleDefender.run(creep);
            }
        }
    }
    
    var towers = _.filter(Game.structures, (s) => s.structureType === STRUCTURE_TOWER);
    if(towers.length > 0) {
        for(t of towers) {
            tower.run(t);
        }
    }
    
    var minHarvesters = 2;
    var minUpgraders = 4;
    var minBuilders = 3;
    
     if(towers.length > 0) {
        minRepairers = 1;
    } else {
        minRepairers = 2;
    }
    
    var hostiles = Game.spawns.Spawn1.room.find(FIND_HOSTILE_CREEPS);
    
     if(Game.spawns.Spawn1.room.find(FIND_HOSTILE_CREEPS).length > 0) {
        minDefenders = hostiles + 2;
    } else {
        minDefenders = 2;
    }
    
    var totalHarvesters = creepByRole('harvester').length;
    var totalDefenders = creepByRole('defender').length;
    var totalUpgraders = creepByRole('upgrader').length;
    var totalBuilders = creepByRole('builder').length;
    var totalRepairers = creepByRole('repairer').length;
    
    var capacity = Game.spawns.Spawn1.room.energyCapacityAvailable;
    var available = Game.spawns.Spawn1.room.energyAvailable;
    
    if(totalHarvesters < minHarvesters) {
        if(totalHarvesters == 0 && available < capacity) {
            spawnByRole('harvester', available);
        } else {
            spawnByRole('harvester', capacity);
        }
    } else if(totalDefenders < minDefenders) {
        spawnByRole('defender', capacity);
    } else if(totalUpgraders < minUpgraders) {
        spawnByRole('upgrader', capacity);
    } else if(totalBuilders < minBuilders) {
        spawnByRole('builder', capacity);
    } else if(totalRepairers < minRepairers) {
        spawnByRole('repairer', capacity);
    }
    
    function creepByRole(role) {
        return _.filter(Game.creeps, (c) => c.memory.role == role);
    }
    
    function spawnByRole(role, capacity) {
        var parts;
        var tier;
        
        if(capacity <= 550) {
            tier = 'basic';
            
            if(role === 'defender') {
                parts = [ATTACK, ATTACK, MOVE, MOVE];
            } else {
                parts = [WORK, WORK, CARRY, MOVE];
            }
        } else if(capacity <= 800) {
            tier = 'advanced';
            
            if(role === 'defender') {
                parts = [ATTACK, ATTACK, ATTACK, TOUGH, MOVE, MOVE, MOVE, MOVE];
            } else {
                parts = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
            }
        } else if(capacity >= 1300) {
            tier = 'master';
            
            if(role === 'defender') {
                parts = [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            } else {
                parts = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
            }
        }
    var name = Game.spawns.Spawn1.createCreep(parts, undefined, {role: role, tier: tier, working: false});
    
        if(!(name < 0)) {
            console.log('Spawned '+tier+ ' ' +role+ ' ' +name+ ' with body: '+parts);
            console.log('Energy Capacity: '+Game.spawns.Spawn1.room.energyCapacityAvailable);
            console.log('Energy Available: '+Game.spawns.Spawn1.room.energyAvailable);
        }
    }
    
    console.log('Harvesters: ' +totalHarvesters);
    console.log('Upgraders: ' +totalUpgraders);
    console.log('Builders: ' +totalBuilders);
    console.log('Defenders: ' +totalDefenders);
    console.log('Repairers: ' +totalRepairers);
    console.log('test');
    
    
    
};
