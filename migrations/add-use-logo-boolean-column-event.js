'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('events', 'use_logo_text', {
      type: Sequelize.BOOLEAN,
      after: 'font_name'   
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('events', 'use_logo_text');
  }
};
