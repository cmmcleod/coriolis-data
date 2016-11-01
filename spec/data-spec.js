var Modules = require('../modules');
var Ships = require('../ships');

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

  var edIDs = {};
  var eddbIDs = {};

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
        expect(group[i].edID > 0).toBeTruthy('Standard module ' + id + ' is missing E:D ID');
        expect(group[i].eddbID > 0 || group[i].pp).toBeTruthy('Standard module' + id + ' is missing EDDB ID');
        expect(group[i].grp).toBeDefined(`No group defined, Type: ${s}, ID: ${id}, Index: ${i}`);
        expect(eddbIDs[group[i].eddbID]).toBeFalsy(`EDDB ID [${group[i].eddbID}] already exists for ID: ${id}, Index: ${i}`);
        expect(edIDs[group[i].edID]).toBeFalsy(`E:D ID [${group[i].edID}] already exists for ID: ${id}, Index: ${i}`);
        if (group[i].eddbID) {
          eddbIDs[group[i].eddbID] = true;
        }
        if (group[i].edID) {
          edIDs[group[i].edID] = true;
        }
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
        expect(group[i].mass).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing mass`);
        expect(group[i].integrity).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing integrity`);
        expect(group[i].eddbID > 0).toBeTruthy(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing EDDB ID`);
        expect(group[i].edID > 0 || group[i].pp).toBeTruthy(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing E:D ID`);
        expect(eddbIDs[group[i].eddbID]).toBeFalsy(`EDDB ID [${group[i].eddbID}] already exists: ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''}`);
        expect(edIDs[group[i].edID]).toBeFalsy(`E:D ID [${group[i].edID}] already exists: ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''}`);
        if (group[i].eddbID) {
          eddbIDs[group[i].eddbID] = true;
        }
        if (group[i].edID) {
          edIDs[group[i].edID] = true;
        }
	if (group[i].dps) {
            expect(group[i].dps).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing dps`);
            expect(group[i].breachmin).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing breachmin`);
            expect(group[i].breachmax).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing breachmax`);
            expect(group[i].breachdps).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing breachdps`);
            expect(group[i].armourpen).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing armourpen`);
            expect(group[i].eps).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing eps`);
            expect(group[i].hps).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing hps`);
        }
	if (group[i].ammo || group[i].reload || group[i].clip) {
            expect(group[i].ammo).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing ammo`);
            expect(group[i].clip).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing clip`);
            expect(group[i].reload).toBeDefined(`Hardpoint ${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing reload`);
        }
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
        expect(group[i].grp).toBeDefined(`No group defined, ID: ${id}`);
        expect(ids[id]).toBeFalsy('ID already exists: ' + id);
        expect(group[i].eddbID > 0 || group[i].pp).toBeTruthy(`${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing EDDB ID`);
        expect(group[i].edID > 0).toBeTruthy(`${group[i].grp}:${id} ${group[i].name ? group[i].name : ''} is missing E:D ID`);
        if (group[i].grp != 'ft') { // Standard and Internal Fuel tanks have the same IDs
          expect(eddbIDs[group[i].eddbID]).toBeFalsy(`EDDB ID [${group[i].eddbID}] already exists:  ${id}`);
          expect(edIDs[group[i].edID]).toBeFalsy(`E:D ID [${group[i].edID}] already exists:  ${id}`);
        }
        if (group[i].eddbID) {
          eddbIDs[group[i].eddbID] = true;
        }
        if (group[i].edID) {
          edIDs[group[i].edID] = true;
        }
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
      expect(Ships[s].eddbID > 0).toBeTruthy(s + ' is missing EDDB ID');
      expect(Ships[s].edID > 0).toBeTruthy(s + ' is missing E:D ID');
      expect(edIDs[Ships[s].edID]).toBeFalsy(`${s} E:D ID [${Ships[s].edID}] already exists`);
      expect(Ships[s].slots.standard.length).toEqual(7, s + ' is missing standard slots');
      expect(Ships[s].defaults.standard.length).toEqual(7, s + ' is missing standard defaults');
      expect(Ships[s].slots.hardpoints.length).toEqual(Ships[s].defaults.hardpoints.length, s + ' hardpoint slots and defaults dont match');
      expect(Ships[s].slots.internal.length).toEqual(Ships[s].defaults.internal.length, s + ' internal slots and defaults dont match');
      expect(Ships[s].retailCost).toBeGreaterThan(Ships[s].properties.hullCost, s + ' has invalid retail cost');
      expect(Ships[s].bulkheads).toBeDefined(s + ' is missing bulkheads');
      expect(Ships[s].bulkheads.length).toEqual(5, s + ' is missing bulkheads');
      if (Ships[s].edID) {
        edIDs[Ships[s].edID] = true;
      }

      for (var i = 0; i < Ships[s].bulkheads.length; i++) {
        var b = Ships[s].bulkheads[i];
        expect(b.id).toBeDefined(`${s} bulkhead [${i}] is missing an ID`);
        expect(bulkheadIds[b.id]).toBeFalsy(`${s} bulkhead [${i} - ${b.id}] ID already exists`);
        expect(b.eddbID > 0).toBeTruthy(`${s} bulkhead [${i} - ${b.id}] is missing EDDB ID`);
        expect(eddbIDs[b.eddbID]).toBeFalsy(`EDDB ID [${b.eddbID}] already exists: ${s} bulkhead [${i} - ${b.id}]`);
        expect(b.edID > 0).toBeTruthy(`${s} bulkhead [${i} - ${b.id}] is missing E:D ID`);
        expect(edIDs[b.edID]).toBeFalsy(`E:D ID [${b.edID}] already exists: ${s} bulkhead [${i} - ${b.id}]`);
        if (b.eddbID) {
          eddbIDs[b.eddbID] = true;
        }
        if (b.edID) {
          edIDs[b.edID] = true;
        }
        bulkheadIds[b.id] = true;
      }
    }
  });

});
