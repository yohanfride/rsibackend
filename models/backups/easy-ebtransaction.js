"use strict";

module.exports = function (sequelize, Sequelize) {
  var ebTransaction = sequelize.define('ebmoney_transaction', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    customer_id :{
      type: Sequelize.INTEGER
    },
    transaction_code: {
      type: Sequelize.STRING(50)
    },
    account: {
      type: Sequelize.STRING(50)
    },
    debit: {
      type: Sequelize.DECIMAL(22, 0)
    },
    credit: {
      type: Sequelize.DECIMAL(22, 0)
    },
    balance: {
      type: Sequelize.DECIMAL(22, 0)
    },
    information: {
      type: Sequelize.TEXT('long')
    },  
    file: {
      type: Sequelize.TEXT('long')
    }, 
    approved_by: {
      type: Sequelize.STRING(50)
    },  
    date_add: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },       
    status: {
      type: Sequelize.INTEGER(11)
    }  
  }, {});

  ebTransaction.associate = function (models) {};

  return ebTransaction;
};