'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get the event ID by event_code
    const [results] = await queryInterface.sequelize.query(
      "SELECT id FROM events WHERE event_code = 'EVALEX2025';"
    );

    if (!results.length) {
      throw new Error('Required event not found for seeding payments.');
    }

    const eventId = results[0].id;

    await queryInterface.bulkInsert('payments', [
      {
        event_id: eventId,
        stripe_payment_intent_id: 'pi_demo_123',
        amount: 150.00,
        currency: 'EUR',
        status: 'completed',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payments', null, {});
  }
};
