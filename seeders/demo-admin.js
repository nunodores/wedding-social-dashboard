'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
    async up(queryInterface) {
        const password = await bcrypt.hash('admin123', 10); // You can change the password
    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@heartgram.com',
        password_hash: password,
        role: 'admin',
        name: 'Admin User',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', {
      email: 'admin@heartgram.com'
    });
  }
};
