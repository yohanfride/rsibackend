"use strict";

module.exports = function (sequelize, Sequelize) {
  var xenditLog = sequelize.define('xendit_log', {
    id: {
    	type: Sequelize.INTEGER,
    	autoIncrement: true,
      primaryKey: true
    }, 
    data: {
      type: Sequelize.TEXT('long')
    }, 
    date_add: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  }, {});

  xenditLog.associate = function (models) {};

  return xenditLog;
};