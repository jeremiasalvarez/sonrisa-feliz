-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3308
-- Generation Time: Feb 03, 2021 at 08:11 PM
-- Server version: 8.0.18
-- PHP Version: 7.4.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `xcio75te7dp3awav`
--

-- --------------------------------------------------------

--
-- Table structure for table `ficha_paciente`
--

DROP TABLE IF EXISTS `ficha_paciente`;
CREATE TABLE IF NOT EXISTS `ficha_paciente` (
  `dni` varchar(8) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(60) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `apellido` varchar(60) CHARACTER SET utf8 COLLATE utf8_spanish_ci DEFAULT NULL,
  `telefono` varchar(60) CHARACTER SET utf8 COLLATE utf8_spanish_ci DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`dni`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Dumping data for table `ficha_paciente`
--

INSERT INTO `ficha_paciente` (`dni`, `id_usuario`, `nombre`, `apellido`, `telefono`, `fecha_nacimiento`, `fecha_creacion`) VALUES
('123456', 16, 'admin', 'admin', '123456', '1988-11-22', '2020-10-15 14:09:54'),
('36116832', 20, 'Nicolas', 'Martinez', '3624758616', '1994-09-15', '2020-10-19 23:51:31'),
('39311766', 18, 'Federico', 'Benitez', '3624068754', '1996-06-16', '2020-10-15 14:19:16'),
('40501677', 19, 'Jeremias', 'Alvarez', '3624880490', '1997-06-13', '2020-10-15 22:47:26'),
('40606463', 21, 'Agustín', 'García', '3624244187', '1997-11-29', '2020-10-20 00:01:45');

-- --------------------------------------------------------

--
-- Table structure for table `historia_clinica_paciente`
--

DROP TABLE IF EXISTS `historia_clinica_paciente`;
CREATE TABLE IF NOT EXISTS `historia_clinica_paciente` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_turno` int(11) NOT NULL,
  `observaciones` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `id_turno` (`id_turno`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `historia_clinica_paciente`
--

INSERT INTO `historia_clinica_paciente` (`id`, `id_usuario`, `id_turno`, `observaciones`) VALUES
(1, 19, 38, NULL),
(2, 19, 39, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `obra_social`
--

DROP TABLE IF EXISTS `obra_social`;
CREATE TABLE IF NOT EXISTS `obra_social` (
  `cod_obra_social` int(11) NOT NULL,
  `nombre` varchar(200) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`cod_obra_social`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Dumping data for table `obra_social`
--

INSERT INTO `obra_social` (`cod_obra_social`, `nombre`) VALUES
(0, 'INSSSEP'),
(1, 'OSDE'),
(2, 'Swiss Medical');

-- --------------------------------------------------------

--
-- Table structure for table `obra_social_paciente`
--

DROP TABLE IF EXISTS `obra_social_paciente`;
CREATE TABLE IF NOT EXISTS `obra_social_paciente` (
  `dni_paciente` varchar(11) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `cod_obra_social` int(11) NOT NULL,
  KEY `cod_obra_social` (`cod_obra_social`),
  KEY `id_paciente` (`dni_paciente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Dumping data for table `obra_social_paciente`
--

INSERT INTO `obra_social_paciente` (`dni_paciente`, `cod_obra_social`) VALUES
('39311766', 0),
('36116832', 0),
('40606463', 0);

-- --------------------------------------------------------

--
-- Table structure for table `pagos_turnos`
--

DROP TABLE IF EXISTS `pagos_turnos`;
CREATE TABLE IF NOT EXISTS `pagos_turnos` (
  `id_pago` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `ya_pago` tinyint(1) NOT NULL,
  `id_turno` int(11) NOT NULL,
  PRIMARY KEY (`id_pago`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `pagos_turnos`
--

INSERT INTO `pagos_turnos` (`id_pago`, `id_usuario`, `ya_pago`, `id_turno`) VALUES
(1, 19, 0, 39);

-- --------------------------------------------------------

--
-- Table structure for table `prestaciones`
--

DROP TABLE IF EXISTS `prestaciones`;
CREATE TABLE IF NOT EXISTS `prestaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8 COLLATE utf8_spanish_ci,
  `precio` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Dumping data for table `prestaciones`
--

INSERT INTO `prestaciones` (`id`, `nombre`, `descripcion`, `precio`) VALUES
(1, 'Relevamiento Bucal', NULL, 10),
(2, 'Restauración de piezas dentales', NULL, 0),
(3, 'Tratamiento de caries', NULL, 0),
(4, 'Endodoncia (Tratamiento de Conducto)', NULL, 0),
(5, 'Extracción de piezas dentales', NULL, 0),
(6, 'Limpieza Bucal', NULL, 0),
(7, 'Tratamiento de caries', NULL, 0),
(8, 'Tratamientos Estéticos - Blanqueamiento bucal', NULL, 0),
(9, 'Tratamientos Estéticos - Carillas de                           Cerámica', NULL, 0),
(10, 'Tratamientos Estéticos - Carillas de                                  Porcelana', NULL, 0),
(11, 'Tratamientos Estéticos - Carillas de                                   Cerómeros', NULL, 0),
(12, 'Tratamientos Estéticos - Implantes', NULL, 0),
(13, 'Tratamientos Estéticos - Ortodoncia estética', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('099q_9Sfpc4BQdafKaeN8VC1uvVO7Heh', 1603547047, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":16}}'),
('4YoZIMl9t6SOkIu2c6sotxnGJa0AzLTN', 1603467967, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('8BGHdizaSbvmD9wiDPUicFOaQhQtZzU9', 1603466346, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{}}'),
('BxbIyBTt8Fp5R-8DXnsng14565soWnj5', 1603538941, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('GvIjMu4b-xZn8sYJMnT7N8t--F1CAukR', 1603467970, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('JABAe7CCDsB9BguXRb1Vw8GqX9ccgEoo', 1603491859, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":19}}'),
('KO1xslrVSaOTOs-PWHQ41QVlcsaikVmX', 1603546190, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":19}}'),
('N-1l5LeNrMS6bi6yHWWHfjRPQDZX36wb', 1603499043, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":18}}'),
('PZUr7hXReuny08HsZ1ROajQ57DkH6_YY', 1603480880, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":19}}'),
('Sf-fOXGw1rwCQajiKqSy53zXBRqt6mRz', 1612468848, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":19}}'),
('VppL7PYfI_vjAbUfNDEqHfPycQJCNJPl', 1603468873, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{}}'),
('g7FzQGowojHlBSyz6JEcm-wwlbNEYKjR', 1603548026, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('mWewXOFkemvgAV7Z5WjERot7ue2Mspcx', 1603497569, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":16}}'),
('q_szwJP-8f9panjHBLt4JaOcf3K4fsLf', 1612469163, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":16}}'),
('rz_6dYsBUA80ihXglUSb8ILj75JcuIv9', 1603467099, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{}}'),
('t4TR3VEr1ZgJHtCqSnMBU2fT0jNxLQfh', 1603480936, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":16}}'),
('tETe-OfKHT5egW9PRt3u33npayKNa2t8', 1603467970, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}');

-- --------------------------------------------------------

--
-- Table structure for table `solicitudes_turno`
--

DROP TABLE IF EXISTS `solicitudes_turno`;
CREATE TABLE IF NOT EXISTS `solicitudes_turno` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_horario` int(11) NOT NULL,
  `fecha_solicitud` datetime NOT NULL,
  `mensaje_solicitud` text CHARACTER SET utf8 COLLATE utf8_spanish_ci,
  `img_ruta` varchar(200) CHARACTER SET utf8 COLLATE utf8_spanish_ci DEFAULT NULL,
  `fecha_solicitada` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_horario` (`id_horario`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `turnos_dias`
--

DROP TABLE IF EXISTS `turnos_dias`;
CREATE TABLE IF NOT EXISTS `turnos_dias` (
  `id_dia` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_dia` varchar(50) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`id_dia`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Dumping data for table `turnos_dias`
--

INSERT INTO `turnos_dias` (`id_dia`, `nombre_dia`) VALUES
(1, 'Lunes'),
(2, 'Martes'),
(3, 'Miércoles'),
(4, 'Jueves'),
(5, 'Viernes');

-- --------------------------------------------------------

--
-- Table structure for table `turnos_horarios`
--

DROP TABLE IF EXISTS `turnos_horarios`;
CREATE TABLE IF NOT EXISTS `turnos_horarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Dumping data for table `turnos_horarios`
--

INSERT INTO `turnos_horarios` (`id`, `hora_inicio`, `hora_fin`) VALUES
(1, '08:00:00', '09:00:00'),
(2, '09:00:00', '10:00:00'),
(3, '10:00:00', '11:00:00'),
(4, '11:00:00', '12:00:00'),
(5, '16:00:00', '17:00:00'),
(6, '17:00:00', '18:00:00'),
(7, '18:00:00', '19:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `turno_paciente`
--

DROP TABLE IF EXISTS `turno_paciente`;
CREATE TABLE IF NOT EXISTS `turno_paciente` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_prestacion` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `id_horario` int(11) NOT NULL,
  `img_ruta` varchar(200) CHARACTER SET utf8 COLLATE utf8_spanish_ci DEFAULT NULL,
  `finalizado` int(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `turno_paciente_ibfk_1` (`id_prestacion`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_horario` (`id_horario`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Dumping data for table `turno_paciente`
--

INSERT INTO `turno_paciente` (`id`, `id_usuario`, `id_prestacion`, `fecha`, `id_horario`, `img_ruta`, `finalizado`) VALUES
(27, 18, 13, '2020-10-30', 4, 'https://grupo11-tsp-metodologia.s3.amazonaws.com/solicitud_turno_18_2020-10-21T2011590000.png', 0),
(35, 19, 1, '2020-10-22', 5, '', 0),
(36, 19, 1, '2020-10-23', 1, '', 0),
(37, 19, 1, '2020-10-30', 5, 'https://grupo11-tsp-metodologia.s3.amazonaws.com/solicitud_turno_19_2020-10-22T1921080000.jpg', 0),
(38, 19, 1, '2020-10-23', 4, '', 0),
(39, 19, 1, '2021-02-04', 1, '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `password` text CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `rol` varchar(20) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL DEFAULT 'paciente',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`id`, `email`, `password`, `rol`, `fecha_creacion`) VALUES
(16, 'admin@admin.com', '$2a$10$cO5BS.e5akhVhWun5T.3lO4RVYGXQa53rpjnpt.w0vulK8f7XOYaW', 'admin', '2020-10-15 14:09:54'),
(18, 'fedebenitez1696@gmail.com', '$2a$10$ha9bwbb/NE/XqvIvaA1kwu24zJUNThZ1r0LIuQzhresIz8MO92Zey', 'paciente', '2020-10-15 14:19:05'),
(19, 'jerealvarez34@gmail.com', '$2a$10$e9Cwa6JijSUwt.GFOoivpeE0HHSrz4GI7LpQ.d0oTGCz2KjAWzp8i', 'paciente', '2020-10-15 22:47:26'),
(20, 'nicolasmartinez864@gmail.com', '$2a$10$016UEuEfLBc62E6zF1KX1OBcR5o9JULxrg7lGfFpGs9hye8BtbLWK', 'paciente', '2020-10-19 23:51:30'),
(21, 'agustinezequiel1997@gmail.com', '$2a$10$wVVLdN3xFMJszKpj0iXtiOGTqqJQm3fWAWdS1DreZ0ICyL4aCUzuW', 'paciente', '2020-10-20 00:01:44');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ficha_paciente`
--
ALTER TABLE `ficha_paciente`
  ADD CONSTRAINT `ficha_paciente_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `historia_clinica_paciente`
--
ALTER TABLE `historia_clinica_paciente`
  ADD CONSTRAINT `historia_clinica_paciente_ibfk_1` FOREIGN KEY (`id_turno`) REFERENCES `turno_paciente` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `historia_clinica_paciente_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `obra_social_paciente`
--
ALTER TABLE `obra_social_paciente`
  ADD CONSTRAINT `obra_social_paciente_ibfk_1` FOREIGN KEY (`cod_obra_social`) REFERENCES `obra_social` (`cod_obra_social`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `obra_social_paciente_ibfk_2` FOREIGN KEY (`dni_paciente`) REFERENCES `ficha_paciente` (`dni`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `solicitudes_turno`
--
ALTER TABLE `solicitudes_turno`
  ADD CONSTRAINT `solicitudes_turno_ibfk_2` FOREIGN KEY (`id_horario`) REFERENCES `turnos_horarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `solicitudes_turno_ibfk_3` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `turno_paciente`
--
ALTER TABLE `turno_paciente`
  ADD CONSTRAINT `turno_paciente_ibfk_1` FOREIGN KEY (`id_prestacion`) REFERENCES `prestaciones` (`id`),
  ADD CONSTRAINT `turno_paciente_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `turno_paciente_ibfk_3` FOREIGN KEY (`id_horario`) REFERENCES `turnos_horarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
