"use strict";

module.exports = function (sequelize, Sequelize) {
  var Ruangan = sequelize.define('ruangan', {
    id_ruangan: {
    	type: Sequelize.INTEGER,
    	autoIncrement: true,
      primaryKey: true
    },
    nomor_ruangan: {
      type: Sequelize.STRING(50)
    }, 
    jenis_ruangan: {
      type: Sequelize.STRING(50)
    },
    status: {
      type: Sequelize.INTEGER(11)
    },
    harga: {
      type: Sequelize.DECIMAL(22, 7)
    },
    keterangan: {
      type: Sequelize.TEXT('long')
    }     
  }, {});

  Ruangan.associate = function (models) {};

  return Ruangan;
}; 