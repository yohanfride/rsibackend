"use strict";

module.exports = function (sequelize, Sequelize) {
  var Logs = sequelize.define('log', {
    log_id: {
    	type: Sequelize.INTEGER,
    	autoIncrement: true,
      primaryKey: true
    },
    endpoint: {
      type: Sequelize.STRING(45)
    },
    request: {
      type: Sequelize.TEXT('long')
    },  
    response: {
      type: Sequelize.TEXT('long')
    },
    status: {
      type: Sequelize.STRING(45)
    },
    response_time:{
      type: Sequelize.INTEGER(11)
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
  }, {});

  Logs.associate = function (models) {};

  return Logs;
};