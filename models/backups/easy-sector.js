"use strict";

module.exports = function (sequelize, Sequelize) {
  var Sector = sequelize.define('sector', {
    sector_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    sector: {
      type: Sequelize.STRING(50)
    },
    group: {
      type: Sequelize.STRING(50)
    },
    city: {
      type: Sequelize.STRING(50)
    },
    province: {
      type: Sequelize.STRING(50)
    },
    type: {
      type: Sequelize.STRING(255)
    },
    coordinates: {
      type: Sequelize.TEXT('long')
    },      
    date_add: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },       
    date_update: {
      type: Sequelize.DATE
    },       
    status: {
      type: Sequelize.INTEGER(11)
    }  
  }, {});

  Sector.associate = function (models) {};

  return Sector;
};