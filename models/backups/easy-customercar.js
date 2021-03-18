"use strict";

module.exports = function (sequelize, Sequelize) {
  var customerCar = sequelize.define('customer_car', {
    customer_car_id: {
    	type: Sequelize.INTEGER,
    	autoIncrement: true,
      primaryKey: true
    },
    customer_id :{
      type: Sequelize.INTEGER
    },
    vehicle_number :{
      type: Sequelize.STRING(50)
    },
    brand :{
      type: Sequelize.STRING(50)
    },
    model :{
      type: Sequelize.STRING(50)
    },
    type :{
      type: Sequelize.STRING(50)
    },
    year :{
      type: Sequelize.INTEGER
    },
    fuel_tank_capacity :{
      type: Sequelize.DECIMAL(22, 2)
    }, 
    fuel_type :{
      type: Sequelize.DECIMAL(22, 2)
    },
    date_add: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  }, {});

  customerCar.associate = function (models) {};

  return customerCar;
};