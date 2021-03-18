"use strict";

module.exports = function (sequelize, Sequelize) {
  var Transaction = sequelize.define('transaction', {
    transaction_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    customer_id :{
      type: Sequelize.INTEGER
    },
    driver_id :{
      type: Sequelize.INTEGER
    },
    car_id :{
      type: Sequelize.INTEGER
    },
    transaction_code: {
      type: Sequelize.STRING(50)
    },
    total_fuel: {
      type: Sequelize.DECIMAL(22, 7)
    },
    fuel_type: {
      type: Sequelize.STRING(50)
    },
    price: {
      type: Sequelize.DECIMAL(22, 7)
    },
    pay: {
      type: Sequelize.DECIMAL(22, 7)
    },
    discount: {
      type: Sequelize.DECIMAL(22, 7)
    },
    location_lat: {
      type: Sequelize.DECIMAL(22, 7)
    },
    location_lng: {
      type: Sequelize.DECIMAL(22, 7)
    },
    location_address: {
      type: Sequelize.TEXT('long')
    },
    location_label:{
      type: Sequelize.STRING(50)
    },
    sector:{
      type: Sequelize.STRING(50)
    },
    note: {
      type: Sequelize.TEXT('long')
    },      
    date_add: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    date_take_order: {
      type: Sequelize.DATE
    },
    date_on_location: {
      type: Sequelize.DATE
    },        
    date_start_transaction: {
      type: Sequelize.DATE
    },       
    date_finish: {
      type: Sequelize.DATE
    },  
    customer_car :{
      type: Sequelize.INTEGER
    },
    cancel_by:{
      type: Sequelize.STRING(50)
    },
    cancel_info: {
      type: Sequelize.TEXT('long')
    },   
    status: {
      type: Sequelize.INTEGER(11)
    },   
    tax: {
      type: Sequelize.DECIMAL(22, 7)
    },
    payment_method:{
      type: Sequelize.STRING(50)
    },
    fcm_device_id: {
      type: Sequelize.TEXT('long')
    },
    date_create_payment: {
      type: Sequelize.DATE
    },
    date_payment_finish: {
      type: Sequelize.DATE
    }, 
    paid: {
      type: Sequelize.INTEGER(11)
    }  
  }, {});

  Transaction.associate = function (models) {};

  return Transaction;
};