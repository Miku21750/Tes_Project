-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 20, 2025 at 06:04 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_cdax_testing`
--

-- --------------------------------------------------------

--
-- Table structure for table `asset_information`
--

CREATE TABLE `asset_information` (
  `AssetID` int(11) NOT NULL,
  `SerialNumber` varchar(100) NOT NULL,
  `ProductName` varchar(255) DEFAULT NULL,
  `ProductNumber` varchar(100) DEFAULT NULL,
  `ProductLine` varchar(100) DEFAULT NULL,
  `SiteAccountID` int(11) DEFAULT NULL,
  `ContactID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `asset_information`
--

INSERT INTO `asset_information` (`AssetID`, `SerialNumber`, `ProductName`, `ProductNumber`, `ProductLine`, `SiteAccountID`, `ContactID`) VALUES
(1, '5CG1329SV6', 'HP 14s-cf2500TX', '483R7PA', 'KV', 1, 1),
(2, '5CG2037V5T', 'HP EliteBook x360 830 G8 Notebook PC (17N15AV)', '43F12UC', 'AN', NULL, 2);

-- --------------------------------------------------------

--
-- Table structure for table `caseinformation`
--

CREATE TABLE `caseinformation` (
  `CaseID` int(11) NOT NULL,
  `SiteAccountID` int(11) DEFAULT NULL,
  `ContactID` int(11) DEFAULT NULL,
  `AssetID` int(11) DEFAULT NULL,
  `CaseSubject` varchar(255) DEFAULT NULL,
  `CaseType` varchar(100) DEFAULT NULL,
  `KCI_Flag` tinyint(1) DEFAULT 0,
  `IncomingChannel` varchar(100) DEFAULT NULL,
  `CaseStatus` varchar(50) DEFAULT NULL,
  `CasePriority` varchar(50) DEFAULT NULL,
  `CustomerSeverity` varchar(50) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CaseClosedDate` datetime DEFAULT NULL,
  `CaseNote` text DEFAULT NULL,
  `SymptomCode` varchar(50) DEFAULT NULL,
  `CaseResolution` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `caseinformation`
--

INSERT INTO `caseinformation` (`CaseID`, `SiteAccountID`, `ContactID`, `AssetID`, `CaseSubject`, `CaseType`, `KCI_Flag`, `IncomingChannel`, `CaseStatus`, `CasePriority`, `CustomerSeverity`, `CreatedOn`, `CaseClosedDate`, `CaseNote`, `SymptomCode`, `CaseResolution`) VALUES
(5000081, 1, 1, 1, 'Laptop Rusak', 'A', 0, NULL, 'Booked', '4', '4', '2025-03-11 00:56:44', NULL, NULL, NULL, NULL),
(5000082, 1, 1, 1, 'Laptop Rusak', 'A', 0, NULL, 'Booked', '4', '4', '2025-03-10 18:02:06', NULL, 'ASADSASSDASAD', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `casenotes`
--

CREATE TABLE `casenotes` (
  `NoteID` int(11) NOT NULL,
  `CaseID` int(11) DEFAULT NULL,
  `LogType` varchar(50) DEFAULT NULL,
  `ActionType` varchar(50) DEFAULT NULL,
  `Template` varchar(100) DEFAULT NULL,
  `VisibleExternally` tinyint(1) DEFAULT 0,
  `MinutesSpent` int(11) DEFAULT NULL,
  `Note` text DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_information`
--

CREATE TABLE `contact_information` (
  `ContactID` int(11) NOT NULL,
  `SiteAccountID` int(11) DEFAULT NULL,
  `Salutation` varchar(20) DEFAULT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `PreferredLanguage` varchar(50) DEFAULT NULL,
  `Phone` varchar(50) DEFAULT NULL,
  `Mobile` varchar(50) DEFAULT NULL,
  `WorkPhone` varchar(50) DEFAULT NULL,
  `WorkExtension` varchar(10) DEFAULT NULL,
  `OtherPhone` varchar(50) DEFAULT NULL,
  `OtherExtension` varchar(10) DEFAULT NULL,
  `Fax` varchar(50) DEFAULT NULL,
  `AddressLine1` varchar(255) DEFAULT NULL,
  `AddressLine2` varchar(255) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `StateProvince` varchar(100) DEFAULT NULL,
  `Country` varchar(100) DEFAULT NULL,
  `ZipPostalCode` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_information`
--

INSERT INTO `contact_information` (`ContactID`, `SiteAccountID`, `Salutation`, `FirstName`, `LastName`, `Email`, `PreferredLanguage`, `Phone`, `Mobile`, `WorkPhone`, `WorkExtension`, `OtherPhone`, `OtherExtension`, `Fax`, `AddressLine1`, `AddressLine2`, `City`, `StateProvince`, `Country`, `ZipPostalCode`) VALUES
(1, 1, 'Mrs', 'Miku21', 'Margareth', 'mikucomunity21@gmail.com', 'Indonesia', '6287731137512', '6287731137512', NULL, NULL, NULL, NULL, NULL, 'Virtual 1', NULL, 'Virtual World', 'Virtual World', 'Virtual', '13413'),
(2, NULL, 'Mr', 'Rafa', 'Elfarizi', 'rafaelfarizi1@gmail.com', 'Indonesia', '6287731137512', '6287731137512', NULL, NULL, NULL, NULL, NULL, 'Dukuh Cenang Desa Cenggini Rt 03 Rw 04', NULL, 'Kab. Tegal', 'Jawa Tengah', 'Indonesia', '40511'),
(3, 1, 'Mrs', 'Aprilia Fidelis', 'Margareth', 'mikucomunity21@gmail.com', 'Indonesia', '6287731137512', '6287731137512', NULL, NULL, NULL, NULL, NULL, 'Virtual 1', NULL, 'Virtual World', 'Virtual World', 'Virtual', '13413'),
(6, NULL, '', 'RAFA', 'ELFARIZI', '', '', '083834685279', '', '', '', '', '', '', 'Dukuh Cenang Desa Cenggini RT 03 RW 04', '', 'Kabupaten tegal', 'Jawa Tengah', '', '40511'),
(8, 1, 'Mr. ', 'RAFA', 'ELFARIZI', '', 'English', '083834685279', '', '', '', '', '', '', 'Dukuh Cenang Desa Cenggini RT 03 RW 04', '', 'Kabupaten tegal', 'Jawa Tengah', 'Indonesia', '40511'),
(9, 3, 'Mrs. ', 'Hatsune', 'Miku', '', 'Spanish', '087731137512', '', '', '', '', '', '', 'Puri Cipageran Indah 1 Blok H4 No 48', '', 'Cimahi', 'Jawa Barat', 'Cina', '40511'),
(12, 3, 'Mr. ', 'RAFA', 'ELFARIZI', '', 'English', '083834685279', '', '', '', '', '', '', 'Dukuh Cenang Desa Cenggini RT 03 RW 04', '', 'Kabupaten tegal', 'Jawa Tengah', 'Malaysia', '40511'),
(13, 3, 'Mrs. ', 'Hatsune', 'Miku', '', 'English', '083834685279', '', '', '', '', '', '', 'Puri Cipageran Indah 1 Blok H4 No 48', '', 'Cimahi', 'Jawa Barat', 'Indonesia', '40511'),
(14, 1, 'Mr. ', 'RAFA', 'ELFARIZI', '', 'English', '083834685279', '', '', '', '', '', '', 'Dukuh Cenang Desa Cenggini RT 03 RW 04', '', 'Kabupaten tegal', 'Jawa Tengah', 'Indonesia', '40511'),
(15, 3, 'Mr. ', 'Slamet', 'Meisa', '', 'Spanish', '083834685279', '', '', '', '', '', '', 'Tegal', '', 'Tegal', 'Jawa Tengah', 'Indonesia', '40511'),
(17, 11, 'Mr. ', 'Slamet', 'Meisa', 'slametmeisa@gmail.com', 'English', '083834685279', '', '', '', '', '', '', 'Dukuh Cenang Desa Cenggini RT 03 RW 04', '', 'Kabupaten tegal', 'Jawa Tengah', 'Singapura', '40511'),
(18, NULL, 'Mr. ', 'Slamet', 'Putra', '', 'English', '083834685279', '', '', '', '', '', '', 'Dukuh Cenang Desa Cenggini RT 03 RW 04', '', 'Kabupaten tegal', 'Jawa Tengah', 'Indonesia', '40511'),
(19, NULL, 'Mr. ', 'Doni', 'Irawan', '', 'English', '083834685279', '083834685279', '083834685279', '', '', '', '451-678', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta', 'DKI Jakarta', 'Indonesia', '40511'),
(20, 11, 'Mr. ', 'Meisa', 'Putra', 'putra@gmail.com', 'Bahasa Indonesia', '083834685279', '083834685279', '', '', '', '', '', 'Dukuh Cenang Desa Cenggini RT 03 RW 04', '', 'Kabupaten tegal', 'Jawa Tengah', 'Singapura', '40511'),
(21, 13, 'Mrs. ', 'jko', 'wi', 'jokowi@gmail.com', 'Bahasa Indonesia', '0829810', '083834685279', '', '', '', '', '', 'Dukuh Cenang Desa Cenggini RT 03 RW 04', '', 'Kabupaten tegal', 'Jawa Tengah', 'Indonesia', '40511'),
(22, NULL, 'Mr. ', 'ibu', 'mega', '', 'Spanish', '081277642718', '0821784784', '', '', '', '', '', 'Dukuh Cenang Desa Cenggini RT 03 RW 04', '', 'jakarta', 'dki jakarta', 'Indonesia', '650192'),
(23, 14, 'Mrs. ', 'Meisa', 'Putra', 'meisaputra@gmail.co.id', 'Bahasa Indonesia', '089677544227', '089677544227', '089677544227', '', '', '', '', 'jakarta', '', 'jakarta', 'dki jakarta', 'Indonesia', '544618'),
(25, 1, 'Mr. ', 'Hatsune', 'Miku', 'rafaelfarizi1@gmail.com', 'Spanish', '083834685279', '', '', '', '', '', '', 'Puri Cipageran Indah 1 Blok H4 No 48', '', 'Cimahi', 'Jawa Barat', '', '40511'),
(26, NULL, 'Mr. ', 'RAFA', 'ELFARIZI', 'rafaelfarizi1@gmail.com', 'Spanish', '083834685279', '', '', '', '', '', '', 'Dukuh Cenang Desa Cenggini RT 03 RW 04', '', 'Kabupaten tegal', 'Jawa Tengah', '', '40511'),
(27, 1, 'Mr. ', 'Hatsune', 'Miku', '', 'Bahasa Indonesia', '', '', '', '', '', '', '', 'Puri Cipageran Indah 1 Blok H4 No 48', '', 'Cimahi', 'Jawa Barat', '', '40511');

-- --------------------------------------------------------

--
-- Table structure for table `materialorder`
--

CREATE TABLE `materialorder` (
  `MOID` int(11) NOT NULL,
  `WOID` int(11) DEFAULT NULL,
  `OrderNumber` varchar(100) DEFAULT NULL,
  `OrderStatus` varchar(50) DEFAULT NULL,
  `OrderType` varchar(50) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `SalesOrderNumber` varchar(100) DEFAULT NULL,
  `RMANumber` varchar(100) DEFAULT NULL,
  `ReadyForClosureDate` datetime DEFAULT NULL,
  `Owner` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `materialorderlineitems`
--

CREATE TABLE `materialorderlineitems` (
  `LineItemID` int(11) NOT NULL,
  `MOID` int(11) DEFAULT NULL,
  `LineNumber` int(11) DEFAULT NULL,
  `PartNumber` varchar(100) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `ATPStatus` varchar(50) DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `servicecatalog`
--

CREATE TABLE `servicecatalog` (
  `ServiceCatalogID` int(11) NOT NULL,
  `ProductNumber` varchar(100) DEFAULT NULL,
  `ProductName` varchar(255) DEFAULT NULL,
  `SerialNumber` varchar(100) DEFAULT NULL,
  `WarrantyStatus` varchar(50) DEFAULT NULL,
  `Currency` varchar(10) DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `Tax` decimal(10,2) DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `servicecatalog_parts`
--

CREATE TABLE `servicecatalog_parts` (
  `PartID` int(11) NOT NULL,
  `ServiceCatalogID` int(11) DEFAULT NULL,
  `PartNumber` varchar(100) DEFAULT NULL,
  `Keyword` varchar(100) DEFAULT NULL,
  `PartDescription` text DEFAULT NULL,
  `Orderability` varchar(50) DEFAULT NULL,
  `RestrictionReason` text DEFAULT NULL,
  `CSR_Flag` tinyint(1) DEFAULT 0,
  `ROHS_Flag` tinyint(1) DEFAULT 0,
  `Returnable_Flag` tinyint(1) DEFAULT 0,
  `HardRoll_Flag` tinyint(1) DEFAULT 0,
  `DangerousGoods_Flag` tinyint(1) DEFAULT 0,
  `LithiumBattery_Flag` tinyint(1) DEFAULT 0,
  `Oversize_Flag` tinyint(1) DEFAULT 0,
  `Heavy_Flag` tinyint(1) DEFAULT 0,
  `Price` decimal(10,2) DEFAULT NULL,
  `FreightPrice` decimal(10,2) DEFAULT NULL,
  `Tax` decimal(10,2) DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `site_account`
--

CREATE TABLE `site_account` (
  `SiteAccountID` int(11) NOT NULL,
  `Company` varchar(255) NOT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `PrimaryPhone` varchar(50) DEFAULT NULL,
  `AddressLine1` varchar(255) NOT NULL,
  `AddressLine2` varchar(255) DEFAULT NULL,
  `City` varchar(100) NOT NULL,
  `StateProvince` varchar(100) DEFAULT NULL,
  `Country` varchar(100) NOT NULL,
  `ZipPostalCode` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_account`
--

INSERT INTO `site_account` (`SiteAccountID`, `Company`, `Email`, `PrimaryPhone`, `AddressLine1`, `AddressLine2`, `City`, `StateProvince`, `Country`, `ZipPostalCode`) VALUES
(1, 'Miku21Store', 'mikucomunity21@gmail.com', '6287731137512', 'Virtual 1', '', 'Virtual World', 'Virtual World', 'Virtual', '13413'),
(3, 'Localhost', 'localhost@gmail.com', '6287731137512', 'Jakarta Pusat', '', 'Jakarta', 'DKI Jakarta', 'Indonesia', '13413'),
(11, 'PT Kapal Api', 'kapalapi@site.com', '087731137512', 'Jakarta Utara', '', 'Jakarta', 'DKI Jakarta', '', '40511'),
(13, 'kapal api abc', 'abc@gmail.com', '089281972', 'Dukuh Cenang Desa Cenggini RT 03 RW 04', '', 'Cimahi', 'Jawa Barat', '', '40511'),
(14, 'PT GUDANG GARAM SEJAHTERA', 'gudanggaram55@gmail.com', '0878299192', 'Surabaya', '', 'surabaya', 'jawa timur', '', '78229');

-- --------------------------------------------------------

--
-- Table structure for table `workorder`
--

CREATE TABLE `workorder` (
  `WOID` int(11) NOT NULL,
  `CaseID` int(11) DEFAULT NULL,
  `ServiceCatalogID` int(11) DEFAULT NULL,
  `WorkOrderNumber` varchar(100) DEFAULT NULL,
  `WorkOrderType` varchar(50) DEFAULT NULL,
  `Priority` varchar(50) DEFAULT NULL,
  `SystemStatus` varchar(50) DEFAULT NULL,
  `SubStatus` varchar(50) DEFAULT NULL,
  `PreferredDay` date DEFAULT NULL,
  `PreferredTime` time DEFAULT NULL,
  `ShipmentCountry` varchar(50) DEFAULT NULL,
  `ShipmentState` varchar(50) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `Owner` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `asset_information`
--
ALTER TABLE `asset_information`
  ADD PRIMARY KEY (`AssetID`),
  ADD KEY `SiteAccountID` (`SiteAccountID`),
  ADD KEY `ContactID` (`ContactID`);

--
-- Indexes for table `caseinformation`
--
ALTER TABLE `caseinformation`
  ADD PRIMARY KEY (`CaseID`),
  ADD KEY `SiteAccountID` (`SiteAccountID`),
  ADD KEY `ContactID` (`ContactID`),
  ADD KEY `AssetID` (`AssetID`);

--
-- Indexes for table `casenotes`
--
ALTER TABLE `casenotes`
  ADD PRIMARY KEY (`NoteID`),
  ADD KEY `CaseID` (`CaseID`);

--
-- Indexes for table `contact_information`
--
ALTER TABLE `contact_information`
  ADD PRIMARY KEY (`ContactID`),
  ADD KEY `SiteAccountID` (`SiteAccountID`);

--
-- Indexes for table `materialorder`
--
ALTER TABLE `materialorder`
  ADD PRIMARY KEY (`MOID`),
  ADD KEY `WOID` (`WOID`);

--
-- Indexes for table `materialorderlineitems`
--
ALTER TABLE `materialorderlineitems`
  ADD PRIMARY KEY (`LineItemID`),
  ADD KEY `MOID` (`MOID`);

--
-- Indexes for table `servicecatalog`
--
ALTER TABLE `servicecatalog`
  ADD PRIMARY KEY (`ServiceCatalogID`);

--
-- Indexes for table `servicecatalog_parts`
--
ALTER TABLE `servicecatalog_parts`
  ADD PRIMARY KEY (`PartID`),
  ADD KEY `ServiceCatalogID` (`ServiceCatalogID`);

--
-- Indexes for table `site_account`
--
ALTER TABLE `site_account`
  ADD PRIMARY KEY (`SiteAccountID`);

--
-- Indexes for table `workorder`
--
ALTER TABLE `workorder`
  ADD PRIMARY KEY (`WOID`),
  ADD KEY `CaseID` (`CaseID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `asset_information`
--
ALTER TABLE `asset_information`
  MODIFY `AssetID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `casenotes`
--
ALTER TABLE `casenotes`
  MODIFY `NoteID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_information`
--
ALTER TABLE `contact_information`
  MODIFY `ContactID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `materialorder`
--
ALTER TABLE `materialorder`
  MODIFY `MOID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `materialorderlineitems`
--
ALTER TABLE `materialorderlineitems`
  MODIFY `LineItemID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `servicecatalog`
--
ALTER TABLE `servicecatalog`
  MODIFY `ServiceCatalogID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `servicecatalog_parts`
--
ALTER TABLE `servicecatalog_parts`
  MODIFY `PartID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `site_account`
--
ALTER TABLE `site_account`
  MODIFY `SiteAccountID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `workorder`
--
ALTER TABLE `workorder`
  MODIFY `WOID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `asset_information`
--
ALTER TABLE `asset_information`
  ADD CONSTRAINT `asset_information_ibfk_1` FOREIGN KEY (`SiteAccountID`) REFERENCES `site_account` (`SiteAccountID`),
  ADD CONSTRAINT `asset_information_ibfk_2` FOREIGN KEY (`ContactID`) REFERENCES `contact_information` (`ContactID`);

--
-- Constraints for table `caseinformation`
--
ALTER TABLE `caseinformation`
  ADD CONSTRAINT `caseinformation_ibfk_1` FOREIGN KEY (`SiteAccountID`) REFERENCES `site_account` (`SiteAccountID`),
  ADD CONSTRAINT `caseinformation_ibfk_2` FOREIGN KEY (`ContactID`) REFERENCES `contact_information` (`ContactID`),
  ADD CONSTRAINT `caseinformation_ibfk_3` FOREIGN KEY (`AssetID`) REFERENCES `asset_information` (`AssetID`);

--
-- Constraints for table `casenotes`
--
ALTER TABLE `casenotes`
  ADD CONSTRAINT `casenotes_ibfk_1` FOREIGN KEY (`CaseID`) REFERENCES `caseinformation` (`CaseID`);

--
-- Constraints for table `contact_information`
--
ALTER TABLE `contact_information`
  ADD CONSTRAINT `contact_information_ibfk_1` FOREIGN KEY (`SiteAccountID`) REFERENCES `site_account` (`SiteAccountID`);

--
-- Constraints for table `materialorder`
--
ALTER TABLE `materialorder`
  ADD CONSTRAINT `materialorder_ibfk_1` FOREIGN KEY (`WOID`) REFERENCES `workorder` (`WOID`);

--
-- Constraints for table `materialorderlineitems`
--
ALTER TABLE `materialorderlineitems`
  ADD CONSTRAINT `materialorderlineitems_ibfk_1` FOREIGN KEY (`MOID`) REFERENCES `materialorder` (`MOID`);

--
-- Constraints for table `servicecatalog_parts`
--
ALTER TABLE `servicecatalog_parts`
  ADD CONSTRAINT `servicecatalog_parts_ibfk_1` FOREIGN KEY (`ServiceCatalogID`) REFERENCES `servicecatalog` (`ServiceCatalogID`);

--
-- Constraints for table `workorder`
--
ALTER TABLE `workorder`
  ADD CONSTRAINT `workorder_ibfk_1` FOREIGN KEY (`CaseID`) REFERENCES `caseinformation` (`CaseID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
