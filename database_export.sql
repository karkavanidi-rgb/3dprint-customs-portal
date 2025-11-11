-- ============================================
-- Database Export for 3DPC Project
-- Generated: 2025-11-11
-- ============================================

-- ============================================
-- TABLE STRUCTURE
-- ============================================

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio table
CREATE TABLE IF NOT EXISTS portfolio (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT,
    files_data TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- DATA: PORTFOLIO
-- ============================================

INSERT INTO portfolio (id, title, description, image_url, display_order, is_visible, created_at, updated_at) VALUES
(1, 'Архитектурные модели', 'Прототипы зданий и сооружений', 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/c9bfcd24-ae58-41ef-bd0a-90e33c1b3557.jpg', 1, true, '2025-11-05 07:12:11.957221', '2025-11-05 13:41:20.675242'),
(2, 'Промышленные детали', 'Функциональные запчасти и механизмы', 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/7d9a3f81-b582-4b41-9ffe-af9e56d32cd0.jpg', 2, true, '2025-11-05 07:12:11.957221', '2025-11-05 13:41:20.675242'),
(3, 'Дизайнерские изделия', 'Уникальные декоративные элементы', 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/0f9e8dda-0c61-4b9d-aff4-8b6c99f882a0.jpg', 3, true, '2025-11-05 07:12:11.957221', '2025-11-05 13:41:20.675242'),
(4, 'Цветная печать', 'Многоцветные изделия высокой детализации', 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/6ec8f6c5-a3f6-46f7-a935-9871ac02c7b3.jpg', 4, true, '2025-11-05 07:12:11.957221', '2025-11-05 13:41:20.675242'),
(5, 'Формы для литья', 'Мастер-модели для производства', 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/4f73c864-e09e-43f4-9b5f-55fe37a69e59.jpg', 5, true, '2025-11-05 07:12:11.957221', '2025-11-05 13:41:20.675242'),
(6, 'Постобработка деталей', 'Шлифовка, покраска и сборка', 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/a1e4c71a-dc9f-4c5d-82b7-66f93bc7d48a.jpg', 6, true, '2025-11-05 07:12:11.957221', '2025-11-05 13:41:20.675242');

-- ============================================
-- DATA: CLIENTS
-- ============================================

INSERT INTO clients (id, name, logo_url, display_order, is_visible, created_at, updated_at) VALUES
(7, '3DPC', 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/ae5e866e-6d6a-4beb-9ddf-36fe9c1e46f0.png', 1, true, '2025-11-05 13:57:58.044765', '2025-11-05 13:57:58.044765');

-- ============================================
-- NOTES
-- ============================================
-- 1. Admins table contains 1 record (password hashes excluded for security)
-- 2. Orders table is empty (0 records)
-- 3. All images are hosted on cdn.poehali.dev
-- 4. To import: psql -U username -d database_name -f database_export.sql
