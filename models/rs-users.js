"use strict";

module.exports = function (sequelize, Sequelize) {
  var Users = sequelize.define('users', {
    id: {
    	type: Sequelize.INTEGER,
    	autoIncrement: true,
      primaryKey: true
    },
    nip: {
      type: Sequelize.STRING(50)
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
    last_login: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    date_add: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    add_by: {
      type: Sequelize.STRING(45)
    },  
    status: {
      type: Sequelize.INTEGER(11)
    },    
    role: {
      type: Sequelize.STRING(50)
    },
    token: {
      type: Sequelize.TEXT('long')
    }     
  }, {});

  Users.associate = function (models) {};

  return Users;
}; 