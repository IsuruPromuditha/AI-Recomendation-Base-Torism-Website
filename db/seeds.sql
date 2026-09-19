-- ==============================================================================
-- WayFarer AI — Seed Data for Sri Lanka Travel & Tour Bookings
-- ==============================================================================

USE `wayfarer_travel_db`;

INSERT INTO `admins` (`username`, `email`, `password_hash`, `full_name`, `role`, `is_active`) VALUES
('admin', 'admin@wayfarer.lk', 'admin123', 'Chief Travel Administrator', 'superadmin', 1),
('operations', 'ops@wayfarer.lk', 'ops123', 'Island Tour Operations Manager', 'admin', 1),
('reservations', 'booking@wayfarer.lk', 'reserve123', 'Front Desk Booking Officer', 'manager', 1);

INSERT INTO `users` (`full_name`, `email`, `password_hash`, `country`, `role`) VALUES
('Travel Admin', 'admin@wayfarer.lk', 'admin123', 'Sri Lanka', 'admin'),
('Chaminda Silva', 'guide.chaminda@wayfarer.lk', 'guide123', 'Sri Lanka', 'guide'),
('Emma Watson', 'emma.w@gmail.com', 'traveler123', 'United Kingdom', 'traveler'),
('Liam Becker', 'liam.b@germany.de', 'traveler123', 'Germany', 'traveler');

INSERT INTO `tours` (`title`, `slug`, `duration_days`, `price_usd`, `difficulty`, `highlights`, `included`, `image_url`) VALUES
('7-Day Golden Triangle & Misty Hill Country', 'golden-triangle-hill-country', 7, 890.00, 'Moderate', 'Sigiriya Rock Fortress, Dambulla Cave Temples, Kandy Temple of the Tooth, Scenic Ella Train Ride, Nine Arch Bridge', 'AC Chauffeur, 4-Star Heritage Hotels, Breakfast & Dinners, Monument Entrance Tickets, First-Class Train Seat', 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&auto=format&fit=crop&q=80'),
('10-Day Complete Pearl of the Indian Ocean', 'complete-pearl-island-explorer', 10, 1350.00, 'Moderate', 'Colombo City Walk, Wilpattu Safari, Sigiriya & Polonnaruwa, Nuwara Eliya Tea Country, Yala Leopard Safari, Galle Dutch Fort', 'Private Luxury Van, Dedicated National Guide, Wildlife Jeep Safaris, All Boutique Hotel Stays, Airport Transfers', 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&auto=format&fit=crop&q=80'),
('5-Day Wildlife Safari & Southern Riviera', 'wildlife-safari-southern-coast', 5, 620.00, 'Easy', 'Udawalawe Elephant Sanctuary, Mirissa Whale Watching, Stilt Fishermen of Koggala, UNESCO Galle Fort Sunset, Cinnamon Island', 'Private 4x4 Safari Jeeps, Beachfront Resorts, Whale Cruise Tickets, Gourmet Seafood Dinners', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80'),
('4-Day Northern Mystique & Jaffna Heritage', 'northern-jaffna-heritage', 4, 520.00, 'Easy', 'Nallur Kandaswamy Kovil, Nainativu Island Ferry, Jaffna Dutch Fort, Point Pedro Northernmost Tip, Authentic Jaffna Crab Feast', 'Intercity AC Express Train / Chauffeur, Heritage Boutique Hotels, Local Tamil Culinary Guide, Island Boat Rides', 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?w=800&auto=format&fit=crop&q=80');

INSERT INTO `bookings` (`booking_ref`, `tour_id`, `customer_name`, `customer_email`, `customer_phone`, `travel_date`, `guests_count`, `package_tier`, `total_amount_usd`, `special_requests`, `status`) VALUES
('WF-81924', 1, 'Emma Watson', 'emma.w@gmail.com', '+44 7700 900077', '2026-11-15', 2, 'Luxury VIP', 2136.00, 'Vegetarian meals required; window seats requested for the Ella train.', 'Confirmed'),
('WF-82410', 2, 'Liam Becker', 'liam.b@germany.de', '+49 151 23456789', '2026-12-05', 3, 'Comfort', 4050.00, 'Interested in photography guidance and early morning leopard tracking.', 'Confirmed'),
('WF-83199', 3, 'Sophie Martin', 'sophie.m@france.fr', '+33 6 12 34 56 78', '2027-01-10', 2, 'Standard', 1240.00, 'Please arrange baby cot in resort.', 'Pending');

INSERT INTO `festivals` (`name`, `religion_culture`, `month_season`, `location`, `significance`) VALUES
('Kandy Esala Perahera', 'Theravada Buddhism', 'July / August (Esala Poya)', 'Kandy (Temple of the Sacred Tooth)', 'Grand 10-night nocturnal procession with caparisoned tusker carrying the sacred casket, fire-dancers, and Kandyan drummers.'),
('Sinhala & Tamil New Year (Aluth Avurudda)', 'National Cultural Heritage', 'April 13 - 14', 'Islandwide', 'Astronomical movement of the sun from Pisces to Aries; traditional hearth lighting, oil cakes (Kevum), and folk games.'),
('Vesak Poya & Lantern Festival', 'Theravada Buddhism', 'May Full Moon', 'Colombo, Kandy & Islandwide', 'Celebration of Buddha Birth, Enlightenment, and Parinirvana with giant illuminated pandols and free food stalls (dansals).'),
('Nallur Kandaswamy Festival', 'Hinduism', 'August - September (25 days)', 'Nallur, Jaffna', 'Most revered Hindu festival in Sri Lanka featuring chariot processions, Kavadi dancers, and devotional hymns to Lord Murugan.'),
('Kataragama Esala Festival', 'Multifaith (Buddhist, Hindu, Vedda, Muslim)', 'July', 'Kataragama Shrine', 'Ancient mystical festival famous for ritual fire-walking across hot embers, holy river bathing, and multifaith pilgrimage.');
