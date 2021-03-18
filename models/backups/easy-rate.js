"use strict";

module.exports = function (sequelize, Sequelize) {
  var Rate = sequelize.define('rate', {
    rate_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    customer_id :{
      type: Sequelize.INTEGER
    },
    driver_id :{
      type: Sequelize.INTEGER
    },
    transaction_code: {
      type: Sequelize.STRING(50)
    },
    rate: {
      type: Sequelize.INTEGER
    },
    comment: {
      type: Sequelize.STRING(255)
    },
    date_add: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }      
  }, {});

  Rate.associate = function (models) {};

  return Rate;
};