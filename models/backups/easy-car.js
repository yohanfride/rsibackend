"use strict";

module.exports = function (sequelize, Sequelize) {
  var Car = sequelize.define('car', {
    car_id: {
    	type: Sequelize.INTEGER,
    	autoIncrement: true,
      primaryKey: true
    },
    gps_uid:{
      type: Sequelize.STRING(50)
    },
    postion_lat: {
      type: Sequelize.DECIMAL(11, 7)
    },
    postion_lng: {
      type: Sequelize.DECIMAL(11, 7)
    },
    capacity: {
      type: Sequelize.DECIMAL(22, 7)
    },
    vehicle_number: {
      type: Sequelize.STRING(50)
    },
    model: {
      type: Sequelize.STRING(50)
    },
    body_machine: {
      type: Sequelize.STRING(50)
    },
    stnk: {
      type: Sequelize.TEXT('long')
    } ,
    tank: {
      type: Sequelize.DECIMAL(22, 7)
    }, 
    owner: {
      type: Sequelize.STRING(50)
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
    photo:{
      type: Sequelize.TEXT('long')
    },
    device_id:{
      type: Sequelize.STRING(50)
    },
    total_km: {
      type: Sequelize.DECIMAL(22, 5)
    },
    maintance_km: {
      type: Sequelize.DECIMAL(22, 5)
    },
    next_service_date : {
      type: Sequelize.DATE,
    },
    last_service_date : {
      type: Sequelize.DATE,
    },
    geo_alert: {
      type: Sequelize.INTEGER(11),
      defaultValue:0
    },
    speed_limit: {
      type: Sequelize.DECIMAL(22, 5)
    },
    speed_limit_alert:{
      type: Sequelize.INTEGER(11),
      defaultValue:0
    },
    last_speed_limit: {
      type: Sequelize.DECIMAL(22, 5)
    },   
    sector: {
      type: Sequelize.STRING(50)
    },  
    fuel: {
      type: Sequelize.STRING(50)
    },
    flow_clock: {
      type: Sequelize.DECIMAL(22, 5)
    }, 
    atg_temp: {
      type: Sequelize.DECIMAL(22, 5)
    }, 
    atg_level: {
      type: Sequelize.DECIMAL(22, 5)
    }, 
    emergency_alert: {
      type: Sequelize.DECIMAL(22, 5)
    }
  }, {});

  Car.associate = function (models) {};

  return Car;
};

    