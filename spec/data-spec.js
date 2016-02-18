var Modules = require('../Modules');
var Ships = require('../Ships');

describe('JSON Data', function() {

  var shipProperties = [
    'name',
    'manufacturer',
    'class',
    'hullCost',
    'speed',
    'boost',
    'boostEnergy',
    'agility',
    'baseShieldStrength',
    'baseArmour',
    'hullMass',
    'masslock',
    'pipSpeed'
  ];

  it('has an up-to-date distribution', function() {
    var dist = require('../dist/index.js');
    expect(dist.Ships).toEqual(Ships, 'Distribution ships does not match. Did you run `npm start`?');
    expect(dist.Modules).toEqual(Modules, 'Distribution modules does not match. Did you run `npm start`?');
  });

  it('has valid standard modules', function() {
    var ids = {};
    for (var s in Modules.standard) {
      var group = Modules.standard[s];
      for (var i = 0; i < group.length; i++) {
        var id = group[i].id;
        expect(ids[id]).toBeFalsy('ID already exists: ' + id);
        expect(group[i].edID).toBeDefined('Standard module' + id + ' is missing E:D ID');
        expect(group[i].eddbID).toBeDefined('Standard module' + id + ' is missing EDDB ID');
        expect(group[i].grp).toBeDefined(`No group defined, Type: ${s}, ID: ${id}, Index: ${i}`);
        ids[id] = true;
      }
    }
  });

  it('has valid hardpoints', function() {
    var ids = {};
    var groups = Modules.hardpoints;

    for (var g in groups) {
      var group = groups[g];
      for (var i = 0; i < group.length; i++) {
        var id = group[i].id;
        expect(ids[id]).toBeFalsy('ID already exists: ' + id);
        expect(group[i].grp).toBeDefined('Hardpoint has no group defined, ID:' + id);
        expect(group[i].eddbID).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing EDDB ID`);
        expect(group[i].edID).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing E:D ID`);
        ids[id] = true;
      }
    }
  });

  it('has valid internal modules', function() {
    var ids = {};
    var groups = Modules.internal;

    for (var g in groups) {
      var group = groups[g];
      for (var i = 0; i < group.length; i++) {
        var id = group[i].id;
        expect(ids[id]).toBeFalsy('ID already exists: ' + id);
        expect(group[i].grp).toBeDefined(`No group defined, ID: ${id}`);
        expect(group[i].eddbID).toBeDefined(`${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing EDDB ID`);
        expect(group[i].edID).toBeDefined(`${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing E:D ID`);
        ids[id] = true;
      }
    }
  });

  it('has data for every ship', function() {
    var bulkheadIds = {};
    for (var s in Ships) {
      for (var p = 0; p < shipProperties.length; p++) {
        expect(Ships[s].properties[shipProperties[p]]).toBeDefined(shipProperties[p] + ' is missing for ' + s);
      }
      expect(Ships[s].eddbID).toBeDefined(s + ' is missing EDDB ID');
      expect(Ships[s].slots.standard.length).toEqual(7, s + ' is missing standard slots');
      expect(Ships[s].defaults.standard.length).toEqual(7, s + ' is missing standard defaults');
      expect(Ships[s].slots.hardpoints.length).toEqual(Ships[s].defaults.hardpoints.length, s + ' hardpoint slots and defaults dont match');
      expect(Ships[s].slots.internal.length).toEqual(Ships[s].defaults.internal.length, s + ' internal slots and defaults dont match');
      expect(Ships[s].retailCost).toBeGreaterThan(Ships[s].properties.hullCost, s + ' has invalid retail cost');
      expect(Ships[s].bulkheads).toBeDefined(s + ' is missing bulkheads');
      expect(Ships[s].bulkheads.length).toEqual(5, s + ' is missing bulkheads');

      for (var i = 0; i < Ships[s].bulkheads.length; i++) {
        var b = Ships[s].bulkheads[i];
        expect(b.id).toBeDefined(`${s} bulkhead [${i}] is missing an ID`);
        expect(bulkheadIds[b.id]).toBeFalsy(`${s} bulkhead [${i} - ${b.id}] ID already exists`);
        expect(b.eddbID).toBeDefined(`${s} bulkhead [${i} - ${b.id}] is missing EDDB ID`);
        // TODO: Get Ids, see github issue  https://github.com/cmmcleod/coriolis-data/issues/6
        //expect(b.edId).toBeDefined(`${s} bulkhead [${i} - ${b.id}] is missing E:D ID`);
        bulkheadIds[b.id] = true;
      }
    }
  });

});
