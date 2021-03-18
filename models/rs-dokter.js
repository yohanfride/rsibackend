"use strict";

module.exports = function (sequelize, Sequelize) {
  var Dokter = sequelize.define('dokter', {
    id_dokter: {
    	type: Sequelize.INTEGER,
    	autoIncrement: true,
      primaryKey: true
    },
    nama_dokter: {
      type: Sequelize.STRING(50)
    }, 
    alamat: {
      type: Sequelize.TEXT('long')
    },   
    no_telp: {
      type: Sequelize.STRING(50)
    },
    spesialis: {
      type: Sequelize.STRING(50)
    } 
  }, {});

  Dokter.associate = function (models) {};

  return Dokter;
}; 