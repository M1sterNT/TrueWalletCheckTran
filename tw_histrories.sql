-- phpMyAdmin SQL Dump
-- version 4.4.15.8
-- https://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 06, 2017 at 03:34 AM
-- Server version: 5.6.31
-- PHP Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_tran`
--

-- --------------------------------------------------------

--
-- Table structure for table `tw_histrories`
--

CREATE TABLE IF NOT EXISTS `tw_histrories` (
  `id` int(11) NOT NULL,
  `tran_id` varchar(655) COLLATE utf8_unicode_ci NOT NULL,
  `ref1` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `ref2` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `amount` int(255) NOT NULL,
  `date` date NOT NULL,
  `status` varchar(25) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `tw_histrories`
--

INSERT INTO `tw_histrories` (`id`, `tran_id`, `ref1`, `ref2`, `amount`, `date`, `status`) VALUES
(1, '50000033583003', 'sss', '', 200, '2017-09-06', 'SUCCEED');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tw_histrories`
--
ALTER TABLE `tw_histrories`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tw_histrories`
--
ALTER TABLE `tw_histrories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
