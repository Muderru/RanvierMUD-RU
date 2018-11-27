'use strict';

module.exports = srcPath => {
  const B = require(srcPath + 'Broadcast');
  const say = B.sayAt;
  const Parser = require(srcPath + 'CommandParser').CommandParser;
  const CommandManager = require(srcPath + 'CommandManager');

  const subcommands = new CommandManager();
  subcommands.add({
    name: 'создать',
    command: state => (args, player) => {
      if (player.party) {
        return say(player, "Вы уже в группе.");
      }

      state.PartyManager.create(player);
      say(player, "<b><yellow>Вы создали группу, приглашайте в нее игроков командой '<white>группа пригласить <имя></white>'</yellow></b>");
    }
  });

  subcommands.add({
    name: 'пригласить',
    command: state => (args, player) => {
      if (!player.party) {
        return say(player, "Вы не в группе, создайте ее командой '<b>группа создать</b>'.");
      }

      if (player.party && player !== player.party.leader) {
        return say(player, "Вы не лидер группы.");
      }

      if (!args.length) {
        return say(player, "Пригласить кого?");
      }

      const target = Parser.parseDot(args, player.room.players);

      if (target === player) {
        return say(player, "Вы спрашиваете себя, вступили ли вы в свою собственную группу? Едва ли.");
      }

      if (!target) {
        return say(player, "Его здесь нет.");
      }

      if (target.party) {
         if (target.gender === 'male') {
           return say(player, "Он уже в группе.");
         } else if (target.gender === 'female') {
           return say(player, "Она уже в группе.");
         } else if (target.gender === 'plural') {
           return say(player, "Они уже в группе.");
         } else {
           return say(player, "Оно уже в группе.");
         }
      }

      say(target, `<b><yellow>${player.name} приглашает вас вступить в группу. Согласитесь/откажитесь командой '<white>группа вступить/отказаться ${player.name}</white>'</yellow></b>`);
      say(player, `<b><yellow>Вы пригласили ${target.vname} присоединиться к группе.</yellow></b>`);
      player.party.invite(target);
      B.prompt(target);
    }
  }
  );

  subcommands.add({
    name: 'распустить',
    command: state => (args, player) => {
      if (!player.party) {
        return say(player, "Вы не в группе.");
      }

      if (player !== player.party.leader) {
        return say(player, "Вы не лидер группы.");
      }

      if (!args || args !== 'да') {
        return say(player, `<b><yellow>Подтвердите роспуск группы командой '<white>группа распустить да</white>'</yellow></b>`);
      }

      say(player.party, '<b><yellow>Группа распущена!</yellow></b>');
      state.PartyManager.disband(player.party);
    }
  });

  subcommands.add({
    name: 'вступить',
    command: state => (args, player) => {
      if (!args.length) {
        return say(player, "В какую группу вы хотите вступить?");
      }

      const target = Parser.parseDot(args, player.room.players);

      if (!target) {
        return say(player, "Их здесь нет.");
      }

      if (!target.party || target !== target.party.leader) {
        return say(player, "Это не лидер группы.");
      }

      if (!target.party.isInvited(player)) {
        return say(player, "Вас туда никто не приглашал.");
      }

      say(player, `<b><yellow>Вы вступили в группу ${target.rname}.</yellow></b>`);
      if (player.gender === 'male') {
        say(target.party, `<b><yellow>${player.name} присоединился к группе.</yellow></b>`);
      } else if (player.gender === 'female') {
        say(target.party, `<b><yellow>${player.name} присоединилась к группе.</yellow></b>`);
      } else if (player.gender === 'plural') {
        say(target.party, `<b><yellow>${player.name} присоединились к группе.</yellow></b>`);
      } else {
        say(target.party, `<b><yellow>${player.name} присоединилось к группе.</yellow></b>`);
      }
      target.party.add(player);
      player.follow(target);
    }
  });

  subcommands.add({
    name: 'отказаться',
    command: state => (args, player) => {
      if (!args.length) {
        return say(player, "Отказаться от чего приглашения?");
      }

      const target = Parser.parseDot(args, player.room.players);

      if (!target) {
        return say(player, "его здесь нет.");
      }

      say(player, `<b><yellow>Вы отказались присоединяться к группе ${target.rname}.</yellow></b>`);
      if (player.gender === 'male') {
        say(target, `<b><yellow>${player.name} отказался присоединяться к группе.</yellow></b>`);
      } else if (player.gender === 'female') {
        say(target, `<b><yellow>${player.name} отказалась присоединяться к группе.</yellow></b>`);
      } else if (player.gender === 'plural') {
        say(target, `<b><yellow>${player.name} отказались присоединяться к группе.</yellow></b>`);
      } else {
        say(target, `<b><yellow>${player.name} отказалось присоединяться к группе.</yellow></b>`);
      }
      target.party.removeInvite(player);
    }
  });

  subcommands.add({
    name: 'покинуть',
    command: state => (args, player) => {
      if (!player.party) {
        return say(player, "Вы не в группе.");
      }

      const party = player.party;
      player.party.delete(player);
      if (player.gender === 'male') {
        say(party, `<b><yellow>${player.name} покинул группу.</yellow></b>`);
      } else if (player.gender === 'female') {
        say(party, `<b><yellow>${player.name} покинула группу.</yellow></b>`);
      } else if (player.gender === 'plural') {
        say(party, `<b><yellow>${player.name} покинули группу.</yellow></b>`);
      } else {
        say(party, `<b><yellow>${player.name} покинуло группу.</yellow></b>`);
      }
      say(player, '<b><yellow>Вы покинули группу.</yellow></b>');
    }
  });

  subcommands.add({
    name: 'список',
    command: state => (args, player) => {
      if (!player.party) {
        return say(player, "Вы не в группе.");
      }

      say(player, '<b>' + B.center(80, 'Группа', 'green', '-') + '</b>');
      for (const member of player.party) {
        let tag = '   ';
        if (member === player.party.leader) {
          tag = '[Л]';
        }
        say(player, `<b><green>${tag} ${member.name}</green></b>`);
      }
    }
  });

  return {
    aliases: [ 'группа' ],
    command: state => (args, player) => {

      if (!args || !args.length) {
        args = 'список';
      }

      const [ command, ...commandArgs ] = args.split(' ');
      const subcommand = subcommands.find(command);

      if (!subcommand) {
        return say(player, "Не допустимая команда.");
      }

      subcommand.command(state)(commandArgs.join(' '), player);
    }
  };
};
