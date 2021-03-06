'use strict';

/**
 * This is an _example_ implementation of a base player class. This, along with
 * CommandParser is one of the few core classes Ranvier encourages you to
 * modify if you want more functionality. Almost all other features can be
 * overridden in bundles.
 */
class NpcRace {
  /**
   * @param {string} id  id corresponding to classes/<id>.js file
   * @param {object} config Definition, this object is completely arbitrary. In
   *     this example implementation it has a name, description, and ability
   *     table. You are free to change this class as you wish
   */
  constructor(id, config) {
    this.id = id;
    this.config = config;
  }

  /**
   * Table of level: abilities learned.
   * Example:
   *     {
   *       1: { skills: ['kick'] },
   *       2: { skills: ['bash'], spells: ['fireball']},
   *       5: { skills: ['rend', 'secondwind'] },
   *     }
   * @type {Object<number, Array<string>>}
   */
  get abilityTable() {
    return this.config.abilityTable;
  }

  get abilityList() {
    return Object.entries(this.abilityTable).reduce((acc, [ , abilities ]) => {
      return acc.concat(abilities.skills || []).concat(abilities.spells || []);
    }, []);
  }

  /**
   * Check to see if this class has a given ability
   * @param {string} id
   * @return {boolean}
   */
  hasAbility(id) {
    return this.abilityList.includes(id);
  }

}

module.exports = NpcRace;
