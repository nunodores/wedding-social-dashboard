'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('events', 'font_name', {
      type: Sequelize.STRING,
      allowNull: true, // or false if required
      after: 'name'   // optional: place after `email`
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('events', 'font_name');
  }
};
