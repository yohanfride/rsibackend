"use strict";

module.exports = function (sequelize, Sequelize) {
  var carOperation = sequelize.define('car_operation', {
    car_operation_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    car_id :{
      type: Sequelize.INTEGER
    },
    start_km: {
      type: Sequelize.DECIMAL(22, 5)
    },
    current_km: {
      type: Sequelize.DECIMAL(22, 5)
    },
    count_km: {
      type: Sequelize.DECIMAL(22, 5)
    }, 
    assurancce: {
      type: Sequelize.DATE
    },        
    assurancce_reminder: {
      type: Sequelize.INTEGER(11)
    },
    stnk: {
      type: Sequelize.DATE
    },        
    stnk_reminder: {
      type: Sequelize.INTEGER(11)
    },
    vehicle_tax: {
      type: Sequelize.DATE
    },        
    vehicle_tax_reminder: {
      type: Sequelize.INTEGER(11)
    },
    keur_dllajr: {
      type: Sequelize.DATE
    },        
    keur_dllajr_reminder: {
      type: Sequelize.INTEGER(11)
    },
    tank_callibration: {
      type: Sequelize.DATE
    },        
    tank_callibration_reminder: {
      type: Sequelize.INTEGER(11)
    }, 
    b3_truck_certification: {
      type: Sequelize.DATE
    },        
    b3_truck_certification_reminder: {
      type: Sequelize.INTEGER(11)
    }, 
    b3_driver_certification: {
      type: Sequelize.DATE
    },        
    b3_driver_certification_reminder: {
      type: Sequelize.INTEGER(11)
    },
    oil_filter: {
      type: Sequelize.DECIMAL(22, 5)
    },
    oil_filter_reminder: {
      type: Sequelize.INTEGER(11)
    },
    oil_gasket: {
      type: Sequelize.DECIMAL(22, 5)
    },
    oil_gasket_reminder: {
      type: Sequelize.INTEGER(11)
    },
    machine_oil: {
      type: Sequelize.DECIMAL(22, 5)
    },
    machine_oil_reminder: {
      type: Sequelize.INTEGER(11)
    },
    busi_4pcs: {
      type: Sequelize.DECIMAL(22, 5)
    },
    busi_4pcs_reminder: {
      type: Sequelize.INTEGER(11)
    },
    differential_oil: {
      type: Sequelize.DECIMAL(22, 5)
    },
    differential_oil_reminder: {
      type: Sequelize.INTEGER(11)
    },
    transmission_oil: {
      type: Sequelize.DECIMAL(22, 5)
    },
    transmission_oil_reminder: {
      type: Sequelize.INTEGER(11)
    },
    air_filter: {
      type: Sequelize.DECIMAL(22, 5)
    },
    air_filter_reminder: {
      type: Sequelize.INTEGER(11)
    },
    brake_fluid: {
      type: Sequelize.DECIMAL(22, 5)
    },
    brake_fluid_reminder: {
      type: Sequelize.INTEGER(11)
    },
    engine_coolant: {
      type: Sequelize.DECIMAL(22, 5)
    },
    engine_coolant_reminder: {
      type: Sequelize.INTEGER(11)
    },
    grease: {
      type: Sequelize.DATE
    },
    grease_reminder: {
      type: Sequelize.INTEGER(11)
    },
    driving_tires: {
      type: Sequelize.DECIMAL(22, 5)
    },
    driving_tires_reminder: {
      type: Sequelize.INTEGER(11)
    },
    steering_wheel: {
      type: Sequelize.DECIMAL(22, 5)
    },
    steering_wheel_reminder: {
      type: Sequelize.INTEGER(11)
    },
    brake_canvas: {
      type: Sequelize.DECIMAL(22, 5)
    },
    brake_canvas_reminder: {
      type: Sequelize.INTEGER(11)
    },
    clutch_canvas: {
      type: Sequelize.DECIMAL(22, 5)
    },
    clutch_canvas_reminder: {
      type: Sequelize.INTEGER(11)
    }
  }, {});

  carOperation.associate = function (models) {};

  return carOperation;
};