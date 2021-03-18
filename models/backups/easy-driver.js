"use strict";

module.exports = function (sequelize, Sequelize) {
  var Driver = sequelize.define('driver', {
    driver_id: {
    	type: Sequelize.INTEGER,
    	autoIncrement: true,
      primaryKey: true
    },
    driver_code: {
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
    photo: {
      type: Sequelize.TEXT('long')
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
    token: {
      type: Sequelize.TEXT('long')
    },   
    ktp: {
      type: Sequelize.TEXT('long')
    },   
    sim: {
      type: Sequelize.TEXT('long')
    },
    birth: {
      type: Sequelize.DATE
    },
    address: {
      type: Sequelize.TEXT('long')
    },
    gender: {
      type: Sequelize.STRING(50)
    }     
  }, {});

  Driver.associate = function (models) {};

  return Driver;
};