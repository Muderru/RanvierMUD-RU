'use strict';

const sprintf = require('sprintf-js').sprintf;
const Combat = require('../../ranvier-combat/lib/Combat');

module.exports = (srcPath) => {
  const B = require(srcPath + 'Broadcast');

  return {
    aliases: [ 'очки', 'характеристики', 'счет' ],
    command : (state) => (args, p) => {
      const say = message => B.sayAt(p, message);

      say('<b>' + B.center(60, `${p.name}, ${p.playerClass.config.name} уровень ${p.level} `, 'green'));
      say('<b>' + B.line(60, '-', 'green'));

      let stats = {
        strength: 0,
        agility: 0,
        intellect: 0,
        stamina: 0,
        armor: 0,
        health: 0,
        critical: 0,
      };

      for (const stat in stats) {
        stats[stat] = {
          current: p.getAttribute(stat) || 0,
          base: p.getBaseAttribute(stat) || 0,
          max: p.getMaxAttribute(stat) || 0,
        };
      }

      B.at(p, sprintf(' %-9s: %12s', 'Здоровье', `${stats.health.current}/${stats.health.max}`));
      say('<b><green>' + sprintf(
        '%36s',
        'Оружие '
      ));

      // class resource
      switch (p.playerClass.id) {
        case 'воин':
          const energy = {
            current: p.getAttribute('energy'),
            max: p.getMaxAttribute('energy')
          };
          B.at(p, sprintf(' %-9s: %12s', 'Бодрость', `${energy.current}/${energy.max}`));
          break;
        case 'маг':
          const mana = {
            current: p.getAttribute('mana'),
            max: p.getMaxAttribute('mana')
          };
          B.at(p, sprintf(' %-9s: %12s', 'Мана', `${mana.current}/${mana.max}`));
          break;
        case 'паладин':
          const favor = {
            current: p.getAttribute('favor'),
            max: p.getMaxAttribute('favor')
          };
          B.at(p, sprintf(' %-9s: %12s', 'Воля', `${favor.current}/${favor.max}`));
          break;
        default:
          B.at(p, B.line(24, ' '));
          break;
      }
      say(sprintf('%35s', '.' + B.line(22)) + '.');

      B.at(p, sprintf('%37s', '|'));
      const weaponDamage = Combat.getWeaponDamage(p);
      const min = Combat.normalizeWeaponDamage(p, weaponDamage.min);
      const max = Combat.normalizeWeaponDamage(p, weaponDamage.max);
      say(sprintf(' %6s:<b>%5s</b> - <b>%-5s</b> |', 'Урон', min, max));
      B.at(p, sprintf('%37s', '|'));
      say(sprintf(' %6s: <b>%12s</b> |', 'Скор.', B.center(12, Combat.getWeaponSpeed(p) + ' сек')));

      say(sprintf('%60s', "'" + B.line(22) + "'"));

      say('<b><green>' + sprintf(
        '%-24s',
        ' Характеристики'
      ) + '</green></b>');
      say('.' + B.line(25) + '.');


      const printStat = (stat, newline = true) => {
        const val = stats[stat];
        const statColor = (val.current > val.base ? 'green' : 'white');
        var ru_stat = '';
        switch(stat) {
            case 'strength':
               ru_stat = 'Сила'
               break;
            case 'agility':
               ru_stat = 'Ловкость'
               break;
            case 'intellect':
               ru_stat = 'Интеллект'
               break;
            case 'stamina':
               ru_stat = 'Выносливость'
               break;
            case 'armor':
               ru_stat = 'Броня'
               break;
            case 'critical':
               ru_stat = 'Крит.шанс'
               break;   
        }
        const str = sprintf(
          `| %-12s : <b><${statColor}>%8s</${statColor}></b> |`,
          ru_stat,
          val.current
        );

        if (newline) {
          say(str);
        } else {
          B.at(p, str);
        }
      };

      printStat('strength', false); // left
      say('<b><green>' + sprintf('%33s', 'Золото ')); // right
      printStat('agility', false); // left
      say(sprintf('%33s', '.' + B.line(12) + '.')); // right
      printStat('intellect', false); // left
      say(sprintf('%19s| <b>%10s</b> |', '', p.getMeta('currencies.золото') || 0)); // right
      printStat('stamina', false); // left
      say(sprintf('%33s', "'" + B.line(12) + "'")); // right

      say(':' + B.line(25) + ':');
      printStat('armor');
      printStat('critical');
      say("'" + B.line(25) + "'");
    }
  };
};
