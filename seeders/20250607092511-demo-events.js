'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');  // import de la fonction uuid v4

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('hashed_event_password', 10);

    await queryInterface.bulkInsert('events', [
      {
        id: uuidv4(),  // génère un UUID string
        name: 'Eva & Alex Wedding',
        event_code: 'EVALEX2025',
        couple_user_id: 4,
        event_date: '2025-09-20',
        description: 'A beautiful wedding in Spain',
        primary_color: '#ff69b4',
        logo_url: null,
        hashed_password: hashedPassword,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('events', {
      event_code: 'EVALEX2025'
    }, {});
  }
};
