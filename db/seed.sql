-- Seed data from products.json
-- Run this after creating the database

-- Insert products
INSERT INTO products (id, slug, title, price_cents, currency, category, image, description, shipping, available) VALUES
('kal-2024-2025', 'peters-world-calendar-2024-2025', 'Peter''s Calendar 2024-2025', 2495, 'EUR', 'calendar', '/products/calendar-2024-2025.png', 'Twelve absurd scenes of Peter for the whole year. High quality print, limited run.', 'Ships in a protective sleeve and cardboard mailer.', 1),
('pillow', 'pillow', 'Pillow', 1295, 'EUR', 'pillow', '/products/pillow-3.png', 'A beautiful Peter pillow with whimsical illustrations. Perfect for adding character to any room.', 'Ships in a protective bag.', 1),
('pc-set-02', 'postcard-set-2', 'Postcard Set 2', 1295, 'EUR', 'postcards', '/products/poster.jpg', 'Another beautiful collection of Peter postcards. Perfect for sending to friends or displaying.', 'Ships in a small rigid envelope.', 1);

-- Insert product details for calendar
INSERT INTO product_details (product_id, detail, sort_order) VALUES
('kal-2024-2025', 'A3 size', 0),
('kal-2024-2025', 'Sturdy paper stock', 1),
('kal-2024-2025', 'Printed in EU', 2);

-- Insert product details for pillow
INSERT INTO product_details (product_id, detail, sort_order) VALUES
('pillow', 'Soft cotton blend', 0),
('pillow', 'Machine washable', 1),
('pillow', '40x40 cm', 2);

-- Insert product details for postcard set
INSERT INTO product_details (product_id, detail, sort_order) VALUES
('pc-set-02', 'Multiple motifs', 0),
('pc-set-02', 'Matte finish', 1),
('pc-set-02', 'High quality', 2);

-- Insert product specs for calendar
INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
('kal-2024-2025', 'Size', '297 by 420 mm'),
('kal-2024-2025', 'Paper', '250 gsm uncoated'),
('kal-2024-2025', 'Binding', 'Wire O');

-- Insert product specs for pillow
INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
('pillow', 'Size', '40x40 cm'),
('pillow', 'Material', 'Cotton blend');

-- Insert product specs for postcard set
INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
('pc-set-02', 'Size', 'A6'),
('pc-set-02', 'Paper', '300 gsm');

-- Insert additional image for pillow
INSERT INTO product_images (product_id, image_url, sort_order) VALUES
('pillow', '/products/pillow-3.png', 0);

