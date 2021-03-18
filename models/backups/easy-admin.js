"use strict";

module.exports = function (sequelize, Sequelize) {
  var Admin = sequelize.define('admin', {
    admin_id: {
    	type: Sequelize.INTEGER,
    	autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING(50)
    },
    password: {
      type: Sequelize.TEXT('long')
    }, 
    name: {
      type: Sequelize.STRING(50)
    },
    phone: {
      type: Sequelize.STRING(50)
    },
    email: {
      type: Sequelize.STRING(45)
    }, 
    date_add: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    add_by: {
      type: Sequelize.STRING(45)
    },     
    otp: {
      type: Sequelize.STRING(50)
    },
    expired_otp: {
      type: Sequelize.DATE
    },
    status: {
      type: Sequelize.INTEGER(11)
    },    
    role: {
      type: Sequelize.STRING(50)
    },
    token: {
      type: Sequelize.TEXT('long')
    },
    business_access: {
      type: Sequelize.INTEGER(11)
    }, 
    operational_access: {
      type: Sequelize.INTEGER(11)
    }     
  }, {});

  Admin.associate = function (models) {};

  return Admin;
}; 