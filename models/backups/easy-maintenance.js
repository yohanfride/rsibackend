"use strict";

module.exports = function (sequelize, Sequelize) {
  var Maintenance = sequelize.define('maintenance', {
    maintenance_id: {
    	type: Sequelize.INTEGER,
    	autoIncrement: true,
      primaryKey: true
    },
    car_id :{
      type: Sequelize.INTEGER
    },
    pic :{
      type: Sequelize.STRING(50)
    },
    date_add: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    date_start: {
      type: Sequelize.DATE
    }, 
    date_finish: {
      type: Sequelize.DATE
    },
    date_next: {
      type: Sequelize.DATE
    },
    note: {
      type: Sequelize.TEXT('long')
    },
    maintenance_location: {
      type: Sequelize.TEXT('long')
    },
    maintenance_type :{
      type: Sequelize.STRING(50)
    },
    cost: {
      type: Sequelize.DECIMAL(22, 0)
    },
    status: {
      type: Sequelize.INTEGER(11)
    }  
  }, {});

  Maintenance.associate = function (models) {};

  return Maintenance;
};