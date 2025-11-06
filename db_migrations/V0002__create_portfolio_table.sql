-- Создаем таблицу для портфолио работ
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

-- Индекс для сортировки по порядку отображения
CREATE INDEX idx_portfolio_order ON portfolio(display_order, created_at DESC);

-- Вставляем текущие работы из translations
INSERT INTO portfolio (title, description, image_url, display_order) VALUES
('Архитектурные модели', 'Прототипы зданий и сооружений', 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/c9bfcd24-ae58-41ef-bd0a-90e33c1b3557.jpg', 1),
('Промышленные детали', 'Функциональные запчасти и механизмы', 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/84d28802-e49a-425e-a385-a6bd3bf4c5d5.jpg', 2),
('Дизайнерские изделия', 'Уникальные декоративные объекты', 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/b9211d56-3f59-4fc7-98e9-529feb4597ca.jpg', 3),
('Цветная печать', 'Цветные и люминесцентные материалы', 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/1588175e-f698-4e69-b9b1-ead3a078f95d.jpg', 4),
('Формы для литья', 'Мастер-модели и литейные формы', 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/c9bfcd24-ae58-41ef-bd0a-90e33c1b3557.jpg', 5),
('Постобработка деталей', 'Шлифовка, покраска и финишная обработка', 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/84d28802-e49a-425e-a385-a6bd3bf4c5d5.jpg', 6);