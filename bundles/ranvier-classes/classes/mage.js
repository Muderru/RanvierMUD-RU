'use strict';

/**
 * See warrior.js for more on classes.
 */
module.exports = srcPath => {
  return {
    name: 'Маг',
    description: 'Маги посвящают многие годы изучению тайных сил и их влиянию на мир. Они не привыкли полагаться на грубую силу. Чтобы выжить в этом враждебном мире, они используют разрушительные заклинания, пока им хватает маны.',
    abilityTable: {
      5: { spells: ['огненный_шар'] },
    },

    setupPlayer: player => {
      player.addAttribute('mana', 100);
      player.prompt = '[ %health.current%/%health.max% <b>hp</b> %mana.current%/%mana.max% <b>mana</b> ]';
    }
  };
};
