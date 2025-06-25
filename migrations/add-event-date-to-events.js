'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column already exists
    const tableDescription = await queryInterface.describeTable('events');
    
    if (!tableDescription.event_date) {
      await queryInterface.addColumn('events', 'event_date', {
        type: Sequelize.DATEONLY,
        allowNull: true,
        after: 'couple_user_id'
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('events', 'event_date');
  }
};