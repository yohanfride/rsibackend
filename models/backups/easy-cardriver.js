"use strict";

module.exports = function (sequelize, Sequelize) {
  var carDriver = sequelize.define('car_driver', {
    car_driver_id: {
    	type: Sequelize.INTEGER,
    	autoIncrement: true,
      primaryKey: true
    },
    car_id :{
      type: Sequelize.INTEGER
    },
    driver_id :{
      type: Sequelize.INTEGER
    },
    date_add: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }, 
    date_finish: {
      type: Sequelize.DATE
    },    
    sector: {
      type: Sequelize.STRING(50)
    },
    status: {
      type: Sequelize.INTEGER(11)
    },
    car_km_start: {
      type: Sequelize.DECIMAL(22, 7)
    },  
    car_km_end: {
      type: Sequelize.DECIMAL(22, 7)
    },
    car_total_km: {
      type: Sequelize.DECIMAL(22, 7)
    },
    car_tank_start: {
      type: Sequelize.DECIMAL(22, 7)
    },  
    car_tank_end: {
      type: Sequelize.DECIMAL(22, 7)
    }
  }, {});

  carDriver.associate = function (models) {};

  return carDriver;
};