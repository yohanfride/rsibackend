"use strict";

module.exports = function (sequelize, Sequelize) {
  var logFilling = sequelize.define('log_filling', {
    log_filling_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    driver_id :{
      type: Sequelize.INTEGER
    },
    car_id :{
      type: Sequelize.INTEGER
    },
    total_fuel: {
      type: Sequelize.DECIMAL(22, 7)
    },
    fuel_type: {
      type: Sequelize.STRING(50)
    },
    total_before_filling: {
      type: Sequelize.DECIMAL(22, 7)
    },
    total_after_filling: {
      type: Sequelize.DECIMAL(22, 7)
    },
    note: {
      type: Sequelize.TEXT('long')
    },      
    date_add: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },       
    date_finish: {
      type: Sequelize.DATE
    },       
    status: {
      type: Sequelize.INTEGER(11)
    }  
  }, {});

  logFilling.associate = function (models) {};

  return logFilling;
};