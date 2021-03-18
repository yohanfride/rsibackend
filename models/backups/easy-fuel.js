"use strict";

module.exports = function (sequelize, Sequelize) {
  var Fuel = sequelize.define('fuel', {
    fuel_id: {
    	type: Sequelize.INTEGER,
    	autoIncrement: true,
      primaryKey: true
    },
    fuel: {
      type: Sequelize.STRING(45)
    }, 
    price: {
      type: Sequelize.DECIMAL(12, 0)
    }, 
    information: {
      type: Sequelize.TEXT('long')
    }, 
    date_update: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    update_by: {
      type: Sequelize.STRING(45)
    } 
  }, {});

  Fuel.associate = function (models) {};

  return Fuel;
};