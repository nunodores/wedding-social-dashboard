'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const hashedPassword = await bcrypt.hash('hashed_couple_password', 10);

      await queryInterface.bulkInsert('users', [
        {
          email: 'couple@example.com',
          password_hash: hashedPassword,
          role: 'couple',
          name: 'Couple User',
          created_at: new Date(),
          updated_at: new Date()
        }
      ], {});
    } catch (err) {
      console.error('Seeding error:', err);
      throw err; // rethrow to fail the migration
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
