'use strict';

module.exports = srcPath => {
  const Broadcast = require(srcPath + 'Broadcast');

  return {
    aliases: ['система'],
    command: state => (args, player) => {
      state.CommandManager.get('help').execute('credits', player);
    }
  };
};
