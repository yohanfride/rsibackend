"use strict";

module.exports = function (sequelize, Sequelize) {
  var Customer = sequelize.define('customer', {
    customer_id: {
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
    address: {
      type: Sequelize.TEXT('long')
    },
    ktp: {
      type: Sequelize.STRING(45)
    },    
    email: {
      type: Sequelize.STRING(45)
    }, 
    date_add: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
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
    location_home: {
      type: Sequelize.TEXT('long')
    },  
    location_home_lat: {
      type: Sequelize.DECIMAL(12, 7)
    },
    location_home_lng: {
      type: Sequelize.DECIMAL(12, 7)
    }, 
    location_work: {
      type: Sequelize.TEXT('long')
    },  
    location_work_lat: {
      type: Sequelize.DECIMAL(12, 7)
    },
    location_work_lng: {
      type: Sequelize.DECIMAL(12, 7)
    },   
    location_place1: {
      type: Sequelize.TEXT('long')
    }, 
    location_place1_lat: {
      type: Sequelize.DECIMAL(12, 7)
    },
    location_place1_lng: {
      type: Sequelize.DECIMAL(12, 7)
    },  
    location_place2: {
      type: Sequelize.TEXT('long')
    }, 
    location_place2_lat: {
      type: Sequelize.DECIMAL(12, 7)
    },
    location_place2_lng: {
      type: Sequelize.DECIMAL(12, 7)
    },    
    location_place3: {
      type: Sequelize.TEXT('long')
    }, 
    location_place3_lat: {
      type: Sequelize.DECIMAL(12, 7)
    },
    location_place3_lng: {
      type: Sequelize.DECIMAL(12, 7)
    }     
  }, {});

  Customer.associate = function (models) {};

  return Customer;
};