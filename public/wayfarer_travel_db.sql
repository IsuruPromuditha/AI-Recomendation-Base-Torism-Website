-- ==============================================================================
-- WayFarer AI — Sri Lanka Travel & Tour Management System
-- MySQL / phpMyAdmin SQL Dump for WAMP Server / XAMPP / MariaDB / MySQL 8.0+
-- Database: `wayfarer_travel_db`
-- ==============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+05:30";

-- ------------------------------------------------------------------------------
-- Database creation and selection
-- ------------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `wayfarer_travel_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `wayfarer_travel_db`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `tours`;
DROP TABLE IF EXISTS `destinations`;
DROP TABLE IF EXISTS `festivals`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `admins`;
DROP TABLE IF EXISTS `scans`;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------------
-- Table structure for `admins` (Administrator Login Credentials & Staff Roles)
-- ------------------------------------------------------------------------------
CREATE TABLE `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(150) NOT NULL,
  `role` ENUM('superadmin', 'admin', 'manager') DEFAULT 'admin',
  `is_active` TINYINT(1) DEFAULT 1,
  `last_login` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table structure for `users` (Tourists, Registered Travelers & Local Guides)
-- ------------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) DEFAULT 'traveler123',
  `country` VARCHAR(100) DEFAULT 'International',
  `role` ENUM('admin', 'guide', 'traveler') DEFAULT 'traveler',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table structure for `destinations` (Sri Lanka Attractions & Heritage Landmarks)
-- ------------------------------------------------------------------------------
CREATE TABLE `destinations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `province` VARCHAR(100) NOT NULL,
  `category` ENUM('Cultural', 'Hill Country', 'Coastal', 'Wildlife', 'Heritage') NOT NULL,
  `latitude` DECIMAL(10, 6) NOT NULL,
  `longitude` DECIMAL(10, 6) NOT NULL,
  `best_time` VARCHAR(100) NOT NULL,
  `highlight` TEXT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table structure for `tours` (Sri Lanka Curated Tour Itineraries)
-- ------------------------------------------------------------------------------
CREATE TABLE `tours` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `duration_days` INT NOT NULL,
  `price_usd` DECIMAL(10, 2) NOT NULL,
  `difficulty` ENUM('Easy', 'Moderate', 'Challenging') DEFAULT 'Easy',
  `highlights` TEXT NOT NULL,
  `included` TEXT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `is_featured` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table structure for `bookings` (Customer Reservations & Payments)
-- ------------------------------------------------------------------------------
CREATE TABLE `bookings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_ref` VARCHAR(20) NOT NULL UNIQUE,
  `tour_id` INT NOT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_email` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(50) NOT NULL,
  `travel_date` DATE NOT NULL,
  `guests_count` INT NOT NULL DEFAULT 1,
  `package_tier` ENUM('Standard', 'Comfort', 'Luxury VIP') DEFAULT 'Comfort',
  `total_amount_usd` DECIMAL(10, 2) NOT NULL,
  `special_requests` TEXT,
  `status` ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Confirmed',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table structure for `festivals` (Cultural Pageants & Religious Celebrations)
-- ------------------------------------------------------------------------------
CREATE TABLE `festivals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `religion_culture` VARCHAR(100) NOT NULL,
  `month_season` VARCHAR(100) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `significance` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table structure for `scans` (Multimodal AI Vision & OCR Records)
-- ------------------------------------------------------------------------------
CREATE TABLE `scans` (
  `id` VARCHAR(64) PRIMARY KEY,
  `identification` VARCHAR(200) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `location_name` VARCHAR(150) NOT NULL,
  `latitude` DECIMAL(10, 6) NOT NULL,
  `longitude` DECIMAL(10, 6) NOT NULL,
  `translation` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- DUMPING SEED DATA
-- ==============================================================================

-- 1. Default Admin Logins (for Administrator Portal)
INSERT INTO `admins` (`username`, `email`, `password_hash`, `full_name`, `role`, `is_active`) VALUES
('admin', 'admin@wayfarer.lk', 'admin123', 'Chief Travel Administrator', 'superadmin', 1),
('operations', 'ops@wayfarer.lk', 'ops123', 'Island Tour Operations Manager', 'admin', 1),
('reservations', 'booking@wayfarer.lk', 'reserve123', 'Front Desk Booking Officer', 'manager', 1);

-- 2. Registered Users & Guides
INSERT INTO `users` (`full_name`, `email`, `password_hash`, `country`, `role`) VALUES
('Travel Admin', 'admin@wayfarer.lk', 'admin123', 'Sri Lanka', 'admin'),
('Chaminda Silva', 'guide.chaminda@wayfarer.lk', 'guide123', 'Sri Lanka', 'guide'),
('Emma Watson', 'emma.w@gmail.com', 'traveler123', 'United Kingdom', 'traveler'),
('Liam Becker', 'liam.b@germany.de', 'traveler123', 'Germany', 'traveler');

-- 3. Destinations
INSERT INTO `destinations` (`name`, `province`, `category`, `latitude`, `longitude`, `best_time`, `highlight`, `image_url`) VALUES
('Sigiriya Rock Fortress', 'Central', 'Cultural', 7.957000, 80.760300, 'Nov to April', '5th-century ancient citadel of King Kasyapa atop a 200m monolithic rock.', 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&auto=format&fit=crop&q=80'),
('Kandy Sacred Tooth Temple', 'Central', 'Heritage', 7.290600, 80.633700, 'Year-round', 'Golden-roofed temple enshrining the sacred tooth relic of Gautama Buddha.', 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&auto=format&fit=crop&q=80'),
('Galle Dutch Fort', 'Southern', 'Coastal', 6.032900, 80.216800, 'Dec to April', 'UNESCO Living 17th-century European fortified city with ramparts and cobblestone paths.', 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&auto=format&fit=crop&q=80'),
('Ella Nine Arch Bridge', 'Uva', 'Hill Country', 6.872200, 81.046400, 'Jan to May', 'Architectural railway viaduct constructed during WWI surrounded by tea fields.', 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?w=800&auto=format&fit=crop&q=80'),
('Yala National Park', 'Southern', 'Wildlife', 6.371200, 81.517000, 'Feb to July', 'Highest leopard density in the world with wild elephants, sloth bears, and crocodiles.', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80');

-- 4. Tour Packages
INSERT INTO `tours` (`title`, `slug`, `duration_days`, `price_usd`, `difficulty`, `highlights`, `included`, `image_url`, `is_featured`) VALUES
('7-Day Golden Triangle & Misty Hill Country', 'golden-triangle-hill-country', 7, 890.00, 'Moderate', 'Sigiriya Rock Fortress, Dambulla Caves, Kandy Tooth Relic Temple, Scenic Ella Highland Train, Nine Arch Bridge', 'AC Chauffeur, 4-Star Heritage Hotels, Breakfast & Dinners, Monument Entrance Tickets, First-Class Train Seat', 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&auto=format&fit=crop&q=80', 1),
('10-Day Complete Pearl Island Explorer', 'complete-pearl-island-explorer', 10, 1350.00, 'Moderate', 'Colombo City Walk, Wilpattu Safari, Sigiriya & Polonnaruwa, Nuwara Eliya Tea Country, Yala Safari, Galle Dutch Fort', 'Private Luxury Van, Dedicated National Guide, Wildlife Jeep Safaris, All Boutique Hotel Stays, Airport Transfers', 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&auto=format&fit=crop&q=80', 1),
('5-Day Wildlife Safari & Southern Riviera', 'wildlife-safari-southern-coast', 5, 620.00, 'Easy', 'Udawalawe Elephant Sanctuary, Mirissa Whale Watching, Stilt Fishermen of Koggala, UNESCO Galle Fort Sunset', 'Private 4x4 Safari Jeeps, Beachfront Resorts, Whale Cruise Tickets, Gourmet Seafood Dinners', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80', 1),
('4-Day Northern Mystique & Jaffna Heritage', 'northern-jaffna-heritage', 4, 520.00, 'Easy', 'Nallur Kandaswamy Kovil, Nainativu Island Ferry, Jaffna Dutch Fort, Point Pedro Tip, Authentic Jaffna Crab Feast', 'Intercity AC Express Train / Chauffeur, Heritage Boutique Hotels, Local Tamil Culinary Guide, Island Boat Rides', 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?w=800&auto=format&fit=crop&q=80', 0);

-- 5. Active Tour Bookings
INSERT INTO `bookings` (`booking_ref`, `tour_id`, `customer_name`, `customer_email`, `customer_phone`, `travel_date`, `guests_count`, `package_tier`, `total_amount_usd`, `special_requests`, `status`) VALUES
('WF-81924', 1, 'Emma Watson', 'emma.w@gmail.com', '+44 7700 900077', '2026-11-15', 2, 'Luxury VIP', 2136.00, 'Vegetarian meals required; window seats requested for the Ella train.', 'Confirmed'),
('WF-82410', 2, 'Liam Becker', 'liam.b@germany.de', '+49 151 23456789', '2026-12-05', 3, 'Comfort', 4050.00, 'Interested in photography guidance and early morning leopard tracking.', 'Confirmed'),
('WF-83199', 3, 'Sophie Martin', 'sophie.m@france.fr', '+33 6 12 34 56 78', '2027-01-10', 2, 'Standard', 1240.00, 'Please arrange baby cot in resort.', 'Pending');

-- 6. Festivals
INSERT INTO `festivals` (`name`, `religion_culture`, `month_season`, `location`, `significance`) VALUES
('Kandy Esala Perahera', 'Theravada Buddhism', 'July / August (Esala Poya)', 'Kandy (Temple of the Sacred Tooth)', 'Grand 10-night nocturnal procession with caparisoned tusker carrying the sacred casket, fire-dancers, and Kandyan drummers.'),
('Sinhala & Tamil New Year (Aluth Avurudda)', 'National Cultural Heritage', 'April 13 - 14', 'Islandwide', 'Astronomical movement of the sun from Pisces to Aries; traditional hearth lighting, oil cakes (Kevum), and folk games.'),
('Vesak Poya & Lantern Festival', 'Theravada Buddhism', 'May Full Moon', 'Colombo, Kandy & Islandwide', 'Celebration of Buddha Birth, Enlightenment, and Parinirvana with giant illuminated pandols and free food stalls (dansals).'),
('Nallur Kandaswamy Festival', 'Hinduism', 'August - September (25 days)', 'Nallur, Jaffna', 'Most revered Hindu festival in Sri Lanka featuring chariot processions, Kavadi dancers, and devotional hymns to Lord Murugan.'),
('Kataragama Esala Festival', 'Multifaith (Buddhist, Hindu, Vedda, Muslim)', 'July', 'Kataragama Shrine', 'Ancient mystical festival famous for ritual fire-walking across hot embers, holy river bathing, and multifaith pilgrimage.');

COMMIT;
