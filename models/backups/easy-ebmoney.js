"use strict";

module.exports = function (sequelize, Sequelize) {
  var ebMoney = sequelize.define('ebmoney', {
    ebmoney_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    customer_id :{
      type: Sequelize.INTEGER
    },
    money: {
      type: Sequelize.DECIMAL(22, 7)
    },   
    date_add: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },       
    date_update: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },       
    status: {
      type: Sequelize.INTEGER(11)
    }  
  }, {});

  ebMoney.associate = function (models) {};

  return ebMoney;
};