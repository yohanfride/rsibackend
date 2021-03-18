"use strict";
const moment = require('moment');

module.exports = function (sequelize, Sequelize) {
  var RekamMedik = sequelize.define('rekam_medik', {
    id_rekam_medik: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }, 
    no_rekam_medik: {
      type: Sequelize.STRING(50)
    }, 
    tanggal_pemeriksaan: {
      type: Sequelize.DATE,
      get: function() {
        return moment.utc(this.getDataValue('tanggal_pemeriksaan')).add(7, 'hours').format('YYYY-MM-DD HH:mm:ss');
      }
    },
    id_dokter: {
      type: Sequelize.INTEGER
    },
    keluhan: {
      type: Sequelize.TEXT('long')
    }, 
    pemeriksaan: {
      type: Sequelize.TEXT('long')
    }, 
    diagnosis: {
      type: Sequelize.TEXT('long')
    }, 
    pengobatan: {
      type: Sequelize.TEXT('long')
    }, 
    resep_obat: {
      type: Sequelize.TEXT('long')
    },
    catatan: {
      type: Sequelize.TEXT('long')
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
    }
  }, {});

  RekamMedik.associate = function (models) {};

  return RekamMedik;
}; 