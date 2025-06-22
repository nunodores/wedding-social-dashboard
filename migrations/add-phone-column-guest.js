'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('guests', 'phone', {
      type: Sequelize.STRING,
      allowNull: true, // or false if required
      after: 'email'   // optional: place after `email`
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('guests', 'phone');
  }
};
