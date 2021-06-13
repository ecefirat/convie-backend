-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Jun 13, 2021 at 12:31 AM
-- Server version: 5.7.32
-- PHP Version: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `convie`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(10) NOT NULL,
  `customer_name` varchar(50) NOT NULL,
  `customer_surname` varchar(50) NOT NULL,
  `customer_email` varchar(50) NOT NULL,
  `customer_password` varchar(255) NOT NULL,
  `customer_address` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) NOT NULL DEFAULT 'http://localhost:5000/uploads/defaultPicture.jpeg',
  `role` varchar(50) NOT NULL DEFAULT 'customer'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `customer_name`, `customer_surname`, `customer_email`, `customer_password`, `customer_address`, `profile_picture`, `role`) VALUES
(4, 'lachlan', 'lach', 'lach@lach.com', 'lach', NULL, 'http://localhost:5000/uploads/defaultPicture.jpeg', 'customer'),
(8, 'sugar', 'f', 'sugar@sugar.com', '$2b$10$mFEHILilcIymMCh6XyW98euiKcMaCvy8B1SiIFovnLoE4CPbqlZiy', 'old address', 'http://localhost:5000/uploads/profilepic.jpeg', 'customer'),
(21, 'James', 'Dean', 'james@dean.com', '$2b$10$Utsm6KrdGoqnmcPyjwIKZOpWgZ8sXkl6g60pA0RWBOovyN9TAVlya', 'main st no:12/2 45-98', 'http://localhost:5000/uploads/cat.jpeg', 'customer'),
(26, 'Admin', 'Admin', 'admin@admin.com', '$2b$10$nN7BK4HcTDdgZC31DDSGkOv5A3MqXi0k8kNgCZEDxOW2HDodX9Goe', 'new address', 'http://localhost:5000/uploads/1.jpeg', 'admin'),
(48, 'Jamie', 'Xxx', 'jamie@xx.com', '$2b$10$.Rxi/6rqRZm6off4JLgg..O83XFIpe4KQ7UC49HNkf93mQkIHSPBS', 'jamie\'s address', 'http://localhost:5000/uploads/cat.jpeg', 'customer');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(10) UNSIGNED NOT NULL,
  `order_amount` decimal(5,2) UNSIGNED NOT NULL,
  `order_address` varchar(255) DEFAULT NULL,
  `order_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `customer_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `order_amount`, `order_address`, `order_date`, `customer_id`) VALUES
(27, '9.98', NULL, '2021-04-26 21:38:54', 8),
(28, '15.95', NULL, '2021-04-27 21:44:27', 8),
(29, '9.98', NULL, '2021-04-28 10:37:51', 8),
(30, '17.97', NULL, '2021-04-28 15:36:04', 8),
(31, '3.98', NULL, '2021-04-30 14:41:54', 8),
(32, '0.00', NULL, '2021-05-01 08:20:55', 8),
(77, '4.99', 'main st. no:12 4000', '2021-05-03 18:43:22', 21),
(78, '4.99', 'main st no:12/2 45-98', '2021-05-07 21:13:03', 21),
(79, '4.99', 'main st no:12/2 45-98', '2021-05-07 21:13:13', 21),
(80, '1.99', 'main st no:12/2 45-98', '2021-05-09 09:45:08', 21),
(82, '1.99', 'main st no:12/2 45-98', '2021-05-09 09:51:28', 21),
(85, '1.99', 'main st no:12/2 45-98', '2021-05-10 12:24:44', 21),
(86, '9.98', 'main st no:12/2 45-98', '2021-05-11 10:12:42', 21),
(107, '1.99', 'testing address', '2021-05-17 20:57:44', 26),
(108, '0.00', 'testing address', '2021-05-17 21:00:34', 26),
(110, '3.99', 'main st no:12/2 45-98', '2021-05-17 21:34:18', 21),
(113, '4.99', 'testing address', '2021-05-18 20:38:09', 26),
(114, '1.99', 'testing address', '2021-05-22 18:55:17', 26),
(115, '4.99', 'testing address', '2021-05-24 10:24:16', 26),
(116, '2.99', 'testing address', '2021-05-24 12:53:01', 26),
(121, '23.00', 'testing address', '2021-05-25 15:10:16', 26),
(123, '4.99', 'testing address', '2021-05-30 10:12:37', 26),
(124, '4.99', 'testing address', '2021-05-30 12:41:30', 26),
(127, '1.99', 'testing address', '2021-06-06 16:23:47', 26),
(130, '10.97', NULL, '2021-06-08 11:44:54', 48),
(131, '1.99', '3333', '2021-06-12 10:23:56', 26);

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `orderdetails_id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `productid` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`orderdetails_id`, `order_id`, `productid`) VALUES
(27, 27, NULL),
(28, 28, NULL),
(29, 29, NULL),
(30, 30, NULL),
(31, 31, NULL),
(32, 32, NULL),
(77, 77, NULL),
(78, 78, NULL),
(79, 79, NULL),
(80, 80, NULL),
(82, 82, NULL),
(85, 85, NULL),
(86, 86, NULL),
(98, 107, NULL),
(99, 108, NULL),
(101, 110, NULL),
(104, 113, NULL),
(105, 114, NULL),
(106, 115, NULL),
(107, 116, NULL),
(108, 123, NULL),
(109, 124, NULL),
(112, 127, NULL),
(114, 130, NULL),
(115, 131, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `pID` int(10) UNSIGNED NOT NULL,
  `pName` varchar(80) NOT NULL,
  `pPrice` decimal(4,2) NOT NULL,
  `pImage` varchar(255) NOT NULL DEFAULT '/images/comingSoon.jpeg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`pID`, `pName`, `pPrice`, `pImage`) VALUES
(1, 'Almond Milk', '1.99', './images/almondmilk.jpg'),
(2, 'Oat Milk', '2.99', './images/oatmilk.jpg'),
(3, 'Maca Milk', '3.99', './images/macamilk.jpg'),
(4, 'Berries', '4.99', './images/frozenberries.jpg'),
(5, 'Bananas', '5.99', './images/bananas.jpg'),
(6, 'Ben&Jerry', '6.99', './images/benjerry.jpg'),
(10, 'Ice cream', '2.00', '/images/comingSoon.jpeg'),
(22, 'Bread', '1.99', '/images/comingSoon.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('HGh6dsYqmx1EmGrZiFkTAbCp-vXDa9J1', 1623713882, '{\"cookie\":{\"originalMaxAge\":172800000,\"expires\":\"2021-06-14T00:35:03.712Z\",\"secure\":false,\"httpOnly\":false,\"path\":\"/\",\"sameSite\":\"lax\"},\"user\":{\"customer_id\":26,\"customer_name\":\"Admin\",\"customer_surname\":\"Admin\",\"customer_email\":\"admin@admin.com\",\"customer_address\":\"new address\",\"profile_picture\":\"http://localhost:5000/uploads/1.jpeg\",\"role\":\"admin\"}}');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `fk_customerId` (`customer_id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`orderdetails_id`),
  ADD KEY `fk_orderid` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`pID`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=132;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `orderdetails_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `pID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_customerId` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `fk_orderid` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
