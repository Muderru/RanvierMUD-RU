'use strict';

const sprintf = require('sprintf-js').sprintf;

module.exports = srcPath => {
  const B = require(srcPath + 'Broadcast');
  const Logger = require(srcPath + 'Logger');

  return {
    aliases: ['умения', 'заклинания', 'способности'],
    command: state => (args, player) => {
      const say = message => B.sayAt(player, message);
      say("<b>" + B.center(80, 'Способности', 'green'));
      say("<b>" + B.line(80, '=', 'green'));

      for (const [ level, abilities ] of Object.entries(player.playerClass.abilityTable)) {
        abilities.skills = abilities.skills || [];
        abilities.spells = abilities.spells || [];

        if (!abilities.skills.length && !abilities.spells.length) {
          continue;
        }

        say(`\r\n<bold>Уровень ${level}</bold>`);
        say(B.line(50));

        let i = 0;
        if (abilities.skills.length) {
          say('\r\n<bold>Умения</bold>');
        }

        for (let skillId of abilities.skills) {
          let skill = state.SkillManager.get(skillId);

          if (!skill) {
            Logger.error(`Недопустимое умение в таблице умений: ${player.playerClass.name}:${level}:${skillId}`);
            continue;
          }

          let name = sprintf("%-20s", skill.name);
          if (player.level >= level) {
            name = `<green>${name}</green>`;
          }
          B.at(player, name);

          if (++i % 3 === 0) {
            say();
          }
        }

        if (abilities.spells.length) {
          say('\r\n<bold>Заклинания</bold>');
        }

        for (let spellId of abilities.spells) {
          let spell = state.SpellManager.get(spellId);

          if (!spell) {
            Logger.error(`Недопустимое заклинание в таблице умений: ${player.playerClass.name}:${level}:${spellId}`);
            continue;
          }

          let name = sprintf("%-20s", spell.name);
          if (player.level >= level) {
            name = `<green>${name}</green>`;
          }
          B.at(player, name);

          if (++i % 3 === 0) {
            say();
          }
        }

        // end with a line break
        say();
      }
    }
  };
};
