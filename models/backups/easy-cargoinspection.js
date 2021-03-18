"use strict";

module.exports = function (sequelize, Sequelize) {
  var CargoInspection = sequelize.define('cargo_inspection', {
    cargo_inspection_id: {
    	type: Sequelize.INTEGER,
    	autoIncrement: true,
      primaryKey: true
    },
    car_id :{
      type: Sequelize.INTEGER
    },
    date_add: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    note: {
      type: Sequelize.TEXT('long')
    },
    tank: {
      type: Sequelize.INTEGER(11)
    },
    atg: {
      type: Sequelize.INTEGER(11)
    },
    flow_meter: {
      type: Sequelize.INTEGER(11)
    },
    pump: {
      type: Sequelize.INTEGER(11)
    },
    power_system: {
      type: Sequelize.INTEGER(11)
    },
    pipeline: {
      type: Sequelize.INTEGER(11)
    },
    hose: {
      type: Sequelize.INTEGER(11)
    },
    box: {
      type: Sequelize.INTEGER(11)
    },
    add_by: {
      type: Sequelize.STRING(45)
    } 
  }, {});

  CargoInspection.associate = function (models) {};

  return CargoInspection;
};