
'use strict';

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');

  return  {
    listeners: {
      playerEnter: state => function (player) {
        if (this.hasEffectType('speaking')) {
          return;
        }

        const speak = state.EffectFactory.create('speak', this, {}, {
          messageList: [
            "Добро пожаловать, %player%. Боевая тренировочная площадка находится на востоке.",
            "На западе ты найдешь магазинчик Вэлла, где можешь купить зелья.",
          ],
          outputFn: message => {
            message = message.replace(/%player%/, player.name);
            state.ChannelManager.get('говорить').send(state, this, message);
          }
        });
        this.addEffect(speak);
      },

      playerLeave: state => function (player) {
        const speaking = this.effects.getByType('speaking');
        if (speaking) {
          speaking.remove();
        }
      }
    }
  };
};
