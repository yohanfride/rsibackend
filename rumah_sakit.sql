-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.1.31-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win32
-- HeidiSQL Version:             11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for rumah_sakit
CREATE DATABASE IF NOT EXISTS `rumah_sakit` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `rumah_sakit`;

-- Dumping structure for table rumah_sakit.dokter
CREATE TABLE IF NOT EXISTS `dokter` (
  `id_dokter` int(11) NOT NULL AUTO_INCREMENT,
  `nama_dokter` char(50) DEFAULT NULL,
  `alamat` char(50) DEFAULT NULL,
  `no_telp` char(50) DEFAULT NULL,
  `spesialis` char(50) DEFAULT NULL,
  PRIMARY KEY (`id_dokter`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Dumping data for table rumah_sakit.dokter: ~4 rows (approximately)
/*!40000 ALTER TABLE `dokter` DISABLE KEYS */;
INSERT INTO `dokter` (`id_dokter`, `nama_dokter`, `alamat`, `no_telp`, `spesialis`) VALUES
	(1, 'Dokter 1', '-', '-', 'umum'),
	(2, 'Dokter 2', '-', '-', 'umum'),
	(3, 'Dokter 3', '-', '-', 'umum'),
	(6, 'Dokter 1', '-', '-', 'umum');
/*!40000 ALTER TABLE `dokter` ENABLE KEYS */;

-- Dumping structure for table rumah_sakit.pasien
CREATE TABLE IF NOT EXISTS `pasien` (
  `id_pasien` int(11) NOT NULL AUTO_INCREMENT,
  `nama` char(50) DEFAULT NULL,
  `no_rekam_medik` char(50) NOT NULL,
  `ktp` char(50) NOT NULL,
  `tgl_lahir` date DEFAULT NULL,
  `tempat_lahir` char(50) DEFAULT NULL,
  `jenis_kelamin` char(50) DEFAULT NULL,
  `alamat` varchar(50) DEFAULT NULL,
  `kota` varchar(50) DEFAULT NULL,
  `no_telp` char(50) DEFAULT NULL,
  `pekerjaan` char(50) DEFAULT NULL,
  PRIMARY KEY (`id_pasien`) USING BTREE,
  UNIQUE KEY `no_rekam_medik` (`no_rekam_medik`),
  UNIQUE KEY `ktp` (`ktp`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Dumping data for table rumah_sakit.pasien: ~4 rows (approximately)
/*!40000 ALTER TABLE `pasien` DISABLE KEYS */;
INSERT INTO `pasien` (`id_pasien`, `nama`, `no_rekam_medik`, `ktp`, `tgl_lahir`, `tempat_lahir`, `jenis_kelamin`, `alamat`, `kota`, `no_telp`, `pekerjaan`) VALUES
	(1, 'Pasien 1', 'PS.202103.00001', '351515140299001', '1989-02-01', 'Surabaya', 'laki-laki', '-', '-', '-', '-'),
	(2, 'Pasien 2', 'PS.202103.00002', '351515140299003', '1989-02-01', 'Surabaya', 'laki-laki', '-', '-', '-', '-'),
	(3, 'Pasien 4', 'PS.202103.00003', '351515010294003', '1994-01-01', 'Surabaya', 'laki-laki', '-', '-', '-', '-'),
	(4, 'Pasien 5', 'PS.202103.00004', '331515010294003', '1994-01-01', 'Malang', 'laki-laki', '-', '-', '-', '-');
/*!40000 ALTER TABLE `pasien` ENABLE KEYS */;

-- Dumping structure for table rumah_sakit.rawat_inap
CREATE TABLE IF NOT EXISTS `rawat_inap` (
  `id_rawat_inap` int(11) NOT NULL AUTO_INCREMENT,
  `id_pasien` int(11) DEFAULT NULL,
  `id_ruangan` int(11) DEFAULT NULL,
  `tanggal_masuk` date DEFAULT NULL,
  `tanggal_keluar` date DEFAULT NULL,
  `biaya_perhari` float DEFAULT NULL,
  `total_biaya` float DEFAULT NULL,
  `aktif` int(11) DEFAULT '1',
  `keterangan` text,
  `date_add` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `add_by` char(50) DEFAULT NULL,
  PRIMARY KEY (`id_rawat_inap`),
  KEY `FK_rawat_inap_ruangan` (`id_ruangan`),
  KEY `FK_rawat_inap_pasien` (`id_pasien`),
  CONSTRAINT `FK_rawat_inap_pasien` FOREIGN KEY (`id_pasien`) REFERENCES `pasien` (`id_pasien`) ON UPDATE CASCADE,
  CONSTRAINT `FK_rawat_inap_ruangan` FOREIGN KEY (`id_ruangan`) REFERENCES `ruangan` (`id_ruangan`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table rumah_sakit.rawat_inap: ~0 rows (approximately)
/*!40000 ALTER TABLE `rawat_inap` DISABLE KEYS */;
/*!40000 ALTER TABLE `rawat_inap` ENABLE KEYS */;

-- Dumping structure for table rumah_sakit.rekam_medik
CREATE TABLE IF NOT EXISTS `rekam_medik` (
  `id_rekam_medik` int(11) NOT NULL AUTO_INCREMENT,
  `no_rekam_medik` char(50) DEFAULT NULL,
  `tanggal_pemeriksaan` datetime DEFAULT NULL,
  `id_dokter` int(11) DEFAULT NULL,
  `keluhan` text,
  `pemeriksaan` text,
  `diagnosis` text,
  `pengobatan` text,
  `resep_obat` text,
  `catatan` text,
  `date_add` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `add_by` char(50) DEFAULT NULL,
  PRIMARY KEY (`id_rekam_medik`),
  KEY `FK_rekam_medik_pasien` (`no_rekam_medik`),
  KEY `FK_rekam_medik_dokter` (`id_dokter`),
  CONSTRAINT `FK_rekam_medik_dokter` FOREIGN KEY (`id_dokter`) REFERENCES `dokter` (`id_dokter`) ON UPDATE CASCADE,
  CONSTRAINT `FK_rekam_medik_pasien` FOREIGN KEY (`no_rekam_medik`) REFERENCES `pasien` (`no_rekam_medik`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;

-- Dumping data for table rumah_sakit.rekam_medik: ~3 rows (approximately)
/*!40000 ALTER TABLE `rekam_medik` DISABLE KEYS */;
INSERT INTO `rekam_medik` (`id_rekam_medik`, `no_rekam_medik`, `tanggal_pemeriksaan`, `id_dokter`, `keluhan`, `pemeriksaan`, `diagnosis`, `pengobatan`, `resep_obat`, `catatan`, `date_add`, `add_by`) VALUES
	(29, 'PS.202103.00001', '2021-03-17 14:07:00', 3, 'Sakit Tenggorokan', '-', 'Radang Tenggorokan', 'pemberian obat pereda nyeri', 'FG Troches', '-', '2021-03-17 15:16:10', '2'),
	(30, 'PS.202103.00001', '2021-03-17 14:07:00', 3, 'Sakit Tenggorokan', '-', 'Radang Tenggorokan', 'pemberian obat pereda nyeri', 'FG Troches', '-', '2021-03-17 15:19:28', '2'),
	(31, 'PS.202103.00002', '2021-03-17 14:07:00', 3, 'Sakit Tenggorokan', '-', 'Radang Tenggorokan', 'pemberian obat pereda nyeri', 'FG Troches', '-', '2021-03-17 15:20:26', '2');
/*!40000 ALTER TABLE `rekam_medik` ENABLE KEYS */;

-- Dumping structure for table rumah_sakit.ruangan
CREATE TABLE IF NOT EXISTS `ruangan` (
  `id_ruangan` int(11) NOT NULL AUTO_INCREMENT,
  `nomor_ruangan` char(50) DEFAULT NULL,
  `jenis_ruangan` char(50) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `harga` float DEFAULT NULL,
  `keterangan` text,
  PRIMARY KEY (`id_ruangan`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table rumah_sakit.ruangan: ~2 rows (approximately)
/*!40000 ALTER TABLE `ruangan` DISABLE KEYS */;
INSERT INTO `ruangan` (`id_ruangan`, `nomor_ruangan`, `jenis_ruangan`, `status`, `harga`, `keterangan`) VALUES
	(1, '1', 'biasa', NULL, 100000, '-'),
	(2, '2', 'biasa', NULL, 100000, '-');
/*!40000 ALTER TABLE `ruangan` ENABLE KEYS */;

-- Dumping structure for table rumah_sakit.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nip` char(50) NOT NULL,
  `username` char(50) NOT NULL DEFAULT '',
  `name` char(50) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL,
  `last_login` datetime NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `role` char(50) NOT NULL DEFAULT '',
  `token` varchar(255) NOT NULL,
  `date_add` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `add_by` char(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Dumping data for table rumah_sakit.users: ~3 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `nip`, `username`, `name`, `password`, `last_login`, `status`, `role`, `token`, `date_add`, `add_by`) VALUES
	(2, '141021012', 'user3', 'user3', 'f5e186405b1ce94d899b2bc7b1e82bd2d2d499ed3d98583ab8e4df902e9fa4f364fabd5643b081a43e81af845eb357f7', '2021-03-15 07:00:03', 1, 'administrator', '', '2021-03-15 14:00:03', ''),
	(3, '141021011', 'user1', 'users1', '618aea8abf3e770974d094f2d7f0aca71d5dd91386963dbca0692c0f0f045147c5cca0eef22e1ded2c61da49875befec', '2021-03-15 07:02:33', 0, 'resepsionis', '', '2021-03-15 14:02:33', ''),
	(4, '141021030', 'user4', 'users4', 'fba2efb6587b38ab0bebc6f1fad390a747439582328c4330ff84e2ee363ea9ed3854670283a57efae78e3d13bab31cdf', '2021-03-15 07:19:34', 1, 'receptionist', '', '2021-03-15 14:19:34', '');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
