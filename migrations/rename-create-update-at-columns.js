'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Guests
    await queryInterface.renameColumn('guests', 'created_at', 'createdAt');
    await queryInterface.renameColumn('guests', 'updated_at', 'updatedAt');

    // Events
    await queryInterface.renameColumn('events', 'created_at', 'createdAt');
    await queryInterface.renameColumn('events', 'updated_at', 'updatedAt');

    // Payments
    await queryInterface.renameColumn('payments', 'created_at', 'createdAt');
    await queryInterface.renameColumn('payments', 'updated_at', 'updatedAt');

    // Notifications
    await queryInterface.renameColumn('notifications', 'created_at', 'createdAt');
    await queryInterface.renameColumn('notifications', 'updated_at', 'updatedAt');

    // Users
    await queryInterface.renameColumn('users', 'created_at', 'createdAt');
    await queryInterface.renameColumn('users', 'updated_at', 'updatedAt');

    // Stories
    await queryInterface.renameColumn('stories', 'created_at', 'createdAt');
    await queryInterface.renameColumn('stories', 'updated_at', 'updatedAt');
    await queryInterface.renameColumn('stories', 'expires_at', 'expiresAt');

    //Likes
    await queryInterface.renameColumn('likes', 'created_at', 'createdAt');
    await queryInterface.renameColumn('likes', 'updated_at', 'updatedAt');

    //Comments
    await queryInterface.renameColumn('comments', 'created_at', 'createdAt');
    await queryInterface.renameColumn('comments', 'updated_at', 'updatedAt');

    //Posts
    await queryInterface.renameColumn('posts', 'created_at', 'createdAt');
    await queryInterface.renameColumn('posts', 'updated_at', 'updatedAt');
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback
    await queryInterface.renameColumn('guests', 'createdAt', 'created_at');
    await queryInterface.renameColumn('guests', 'updatedAt', 'updated_at');

    await queryInterface.renameColumn('events', 'createdAt', 'created_at');
    await queryInterface.renameColumn('events', 'updatedAt', 'updated_at');

    await queryInterface.renameColumn('payments', 'createdAt', 'created_at');
    await queryInterface.renameColumn('payments', 'updatedAt', 'updated_at');

    await queryInterface.renameColumn('notifications', 'createdAt', 'created_at');
    await queryInterface.renameColumn('notifications', 'updatedAt', 'updated_at');

    await queryInterface.renameColumn('users', 'createdAt', 'created_at');
    await queryInterface.renameColumn('users', 'updatedAt', 'updated_at');
  }
};
