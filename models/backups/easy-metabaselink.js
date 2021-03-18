"use strict";

module.exports = function (sequelize, Sequelize) {
  var Metabaselink = sequelize.define('metabaselink', {
    metabaselink_id: {
    	type: Sequelize.INTEGER,
    	autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(255)
    },  
    code: {
      type: Sequelize.STRING(45)
    },  
    detail: {
      type: Sequelize.TEXT('long')
    },
    link: {
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

  Metabaselink.associate = function (models) {};

  return Metabaselink;
};