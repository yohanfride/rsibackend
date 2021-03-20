"use strict";
const moment = require('moment');

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
      defaultValue: Sequelize.NOW,
      get: function() {
        return moment.utc(this.getDataValue('last_login')).add(7, 'hours').format('YYYY-MM-DD HH:mm:ss');
      }
    },
    date_add: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      get: function() {
        return moment.utc(this.getDataValue('date_add')).add(7, 'hours').format('YYYY-MM-DD HH:mm:ss');
      }
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
    id_dokter: {
      type: Sequelize.INTEGER
    }     
  }, {});

  Users.associate = function (models) {};

  return Users;
}; 