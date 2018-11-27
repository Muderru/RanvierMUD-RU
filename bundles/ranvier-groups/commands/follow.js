'use strict';

module.exports = srcPath => {
  const Broadcast = require(srcPath + 'Broadcast');
  const CommandParser = require(srcPath + 'CommandParser').CommandParser;

  return {
    aliases: [ 'следовать' ],
    command: state => (arg, player) => {
      if (!arg || !arg.length) {
        return Broadcast.sayAt(player, 'Следовать за кем?');
      }

      let target = CommandParser.parseDot(arg, player.room.players);

      if (!target) {
        if (arg === 'я') {
          target = player;
        } else {
          return Broadcast.sayAt(player, "Никого с таким именем здесь нет.");
        }
      }

      // follow self unfollows the person they're currently following
      if (target === player) {
        if (player.following) {
           if (player.gender === 'male') {
             Broadcast.sayAt(player.following, `${player.name} перестал следовать за вами.`);
           } else if (player.gender === 'female') {
             Broadcast.sayAt(player.following, `${player.name} перестала следовать за вами.`);
           } else if (player.gender === 'plural') {
             Broadcast.sayAt(player.following, `${player.name} перестали следовать за вами.`);
           } else {
             Broadcast.sayAt(player.following, `${player.name} перестало следовать за вами.`);
           }  

          Broadcast.sayAt(player, `Вы перестали следовать за ${player.following.tname}.`);
          player.unfollow();
        } else {
          Broadcast.sayAt(player, "Вы не можете следовать за самим собой...");
        }

        return;
      }

      Broadcast.sayAt(player, `Вы начали следовать за ${target.tname}.`);
      if (player.gender === 'male') {
        Broadcast.sayAt(target, `${player.name} начал следовать за вами.`);
      } else if (player.gender === 'female') {
        Broadcast.sayAt(target, `${player.name} начала следовать за вами.`);
      } else if (player.gender === 'plural') {
        Broadcast.sayAt(target, `${player.name} начали следовать за вами.`);
      } else {
        Broadcast.sayAt(target, `${player.name} начало следовать за вами.`);
      }

      player.follow(target);
    }
  };
};
