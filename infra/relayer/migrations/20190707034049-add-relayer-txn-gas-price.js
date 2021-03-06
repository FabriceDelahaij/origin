'use strict'

const tableName = 'relayer_txn'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      tableName,
      'gas_price',
      { type: Sequelize.Sequelize.BIGINT }
    )
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn(
      tableName,
      'gas_price'
    )
  }
}
