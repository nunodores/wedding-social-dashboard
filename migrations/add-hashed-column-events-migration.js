module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn('events', 'hashedPassword', {
            type: Sequelize.STRING
        });
    }
};