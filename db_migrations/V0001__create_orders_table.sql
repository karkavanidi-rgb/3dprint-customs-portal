-- Создаем таблицу заявок для 3D печати
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_type VARCHAR(50) NOT NULL,
    company_name VARCHAR(255),
    inn VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    length DECIMAL(10,2),
    width DECIMAL(10,2),
    height DECIMAL(10,2),
    plastic_type VARCHAR(100),
    color VARCHAR(100),
    infill INTEGER,
    quantity INTEGER NOT NULL DEFAULT 1,
    description TEXT,
    file_url TEXT,
    file_name VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрого поиска по статусу и дате
CREATE INDEX idx_orders_status_created ON orders(status, created_at DESC);
CREATE INDEX idx_orders_email ON orders(email);