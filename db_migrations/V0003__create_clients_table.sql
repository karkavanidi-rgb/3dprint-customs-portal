CREATE TABLE IF NOT EXISTS t_p54189513_3dprint_customs_port.clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO t_p54189513_3dprint_customs_port.clients (name, logo_url, display_order, is_visible) VALUES
('Yandex', 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/f59d3d52-10e3-4c65-8448-bb13279fecfa.jpg', 1, true),
('iRayple', 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/ddd1e75f-968d-4590-847d-9ac38cfa2a45.jpg', 2, true),
('Gazprom', 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/e158635f-fd30-4ef4-9de2-6642746774ce.jpg', 3, true),
('Rosneft', 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/22e16cd4-4f3c-4d70-86e8-2043b3a1b223.jpg', 4, true),
('Alfa Bank', 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/eda10eaf-86eb-44ad-b7af-21c03ef0e296.jpg', 5, true),
('Moscow Metro', 'https://cdn.poehali.dev/projects/cde2bfc9-e8bf-4329-aed0-a822a287b9dd/files/bd5f4241-5588-4f44-b60a-d1359b199ef9.jpg', 6, true);