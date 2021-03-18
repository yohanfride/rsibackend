"use strict";

module.exports = function (sequelize, Sequelize) {
  var Pasien = sequelize.define('pasien', {
    id_pasien: {
    	type: Sequelize.INTEGER,
    	autoIncrement: true,
      primaryKey: true
    },
    nama: {
      type: Sequelize.STRING(50)
    }, 
    no_rekam_medik: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    }, 
    ktp: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    }, 
    tgl_lahir: {
      type: Sequelize.DATE
    },
    tempat_lahir: {
      type: Sequelize.STRING(50)
    },  
    jenis_kelamin: {
      type: Sequelize.STRING(50)
    }, 
    alamat: {
      type: Sequelize.TEXT('long')
    },   
    kota: {
      type: Sequelize.STRING(50)
    },   
    no_telp: {
      type: Sequelize.STRING(50)
    },
    pekerjaan: {
      type: Sequelize.STRING(50)
    } 
  }, {});

  Pasien.associate = function (models) {};

  return Pasien;
}; 