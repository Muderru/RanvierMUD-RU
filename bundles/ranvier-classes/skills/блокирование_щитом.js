'use strict';

/**
 * Damage mitigation skill
 */
module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const SkillType = require(srcPath + 'SkillType');

  // config placed here just for easy configuration of this skill later on
  const attribute = 'strength';
  const cooldown = 45;
  const cost = 50;
  const healthPercent = 15;
  const duration = 20 * 1000;

  
  return {
    name: 'Блокирование щитом',
    type: SkillType.SKILL,
    requiresTarget: false,
    resource: {
      attribute: 'energy',
      cost,
    },
    cooldown,

    run: state => function (args, player, target) {
      if (!player.equipment.has('shield')) {
        Broadcast.sayAt(player, "Вы не держите щит!");
        return false;
      }

      const effect = state.EffectFactory.create(
        'skill.shieldblock',
        player,
        {
          duration,
          description: this.info(player),
        },
        {
          magnitude: Math.round(player.getMaxAttribute('health') * (healthPercent / 100))
        }
      );
      effect.skill = this;

      Broadcast.sayAt(player, `<b>Вы подняли ваш щит, блокируя атаки врагов!</b>`);
      if (player.gender === 'male') {
        Broadcast.sayAtExcept(player.room, `<b>${player.name} поднял свой щит, блокируя атаки врагов.</b>`, [player]);
      } else if (player.gender === 'female') {
        Broadcast.sayAtExcept(player.room, `<b>${player.name} подняла свой щит, блокируя атаки врагов.</b>`, [player]);
      } else if (player.gender === 'plural') {
        Broadcast.sayAtExcept(player.room, `<b>${player.name} подняли свои щиты, блокируя атаки врагов.</b>`, [player]);
      } else {
        Broadcast.sayAtExcept(player.room, `<b>${player.name} подняло свой щит, блокируя атаки врагов.</b>`, [player]);
      }

      player.addEffect(effect);
    },

    info: (player) => {
      return `Поднимите ваш щит и блокируйте <bold>${healthPercent}%</bold> урона от вашего максимального здоровья в течении <bold>${duration / 1000}</bold> секунд. Требует щит.`;
    }
  };
};

