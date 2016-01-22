var Modules = require('../Modules');
var Ships = require('../Ships');

describe('Database', function() {

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

  it('has same number of components as EDDB', function() {
    var totalComponentCount = 0, g;
    for (g = 0; g < Modules.standard.length; g++) {
      var group = Modules.standard[g];
      for (var i in group) {
        totalComponentCount++;
      }
    }
    for (g in Modules.bulkheads) {
        totalComponentCount += 5;
    }
    for (g in Modules.hardpoints) {
      totalComponentCount += Modules.hardpoints[g].length;
    }
    for (g in Modules.internal) {
      if (g != 'ft') {  // EDDB does not have internal fuel tanks listed seperately
        totalComponentCount += Modules.internal[g].length;
      }
    }
  });

  it('has valid standard components', function() {
    var ids = {};
    for (var i = 0; i < Modules.standard.length; i++) {
      var group = Modules.standard[i];
      for (var c in group) {
        var id = group[c].id;
        expect(ids[id]).toBeFalsy('ID already exists: ' + id);
        expect(group[c].eddbID).toBeDefined('Standard component' + id + ' is missing EDDB ID');
        expect(group[c].grp).toBeDefined('Common component has no group defined, Type: ' + i + ', ID: ' + c);
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
        expect(group[i].eddbID).toBeDefined('Hardpoint ' + id + ' is missing EDDB ID');
        ids[id] = true;
      }
    }
  });

  it('has valid internal components', function() {
    var ids = {};
    var groups = Modules.internal;

    for (var g in groups) {
      var group = groups[g];
      for (var i = 0; i < group.length; i++) {
        var id = group[i].id;
        expect(ids[id]).toBeFalsy('ID already exists: ' + id);
        expect(group[i].grp).toBeDefined('Internal component has no group defined, ID:' + id);
        expect(group[i].eddbID).toBeDefined('Internal ' + id + ' is missing EDDB ID');
        ids[id] = true;
      }
    }
  });

  it('has data for every ship', function() {
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
    }
  });

});
