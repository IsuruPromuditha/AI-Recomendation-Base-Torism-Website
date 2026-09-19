-- ==============================================================================
-- WayFarer AI — Sri Lanka Travel & Tour Management System
-- MySQL / phpMyAdmin Compatible Database Schema
-- Compatible with MySQL 5.7+, MySQL 8.0+, and MariaDB
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `tours`;
DROP TABLE IF EXISTS `destinations`;
DROP TABLE IF EXISTS `dishes`;
DROP TABLE IF EXISTS `festivals`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `scans`;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------------
-- Table structure for `users`
-- ------------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `country` VARCHAR(100) DEFAULT 'International',
  `role` ENUM('admin', 'guide', 'traveler') DEFAULT 'traveler',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table structure for `destinations`
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
-- Table structure for `tours`
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
-- Table structure for `bookings`
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
-- Table structure for `festivals`
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
-- Table structure for `scans`
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
