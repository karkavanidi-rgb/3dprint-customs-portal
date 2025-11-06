export interface Order {
  id: number;
  customer_type: string;
  company_name?: string;
  inn?: string;
  email: string;
  phone?: string;
  length?: number;
  width?: number;
  height?: number;
  plastic_type?: string;
  color?: string;
  infill?: number;
  quantity: number;
  description?: string;
  file_url?: string;
  file_name?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ClientItem {
  id: number;
  name: string;
  logo_url: string;
  display_order: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export const statusLabels: Record<string, string> = {
  new: 'Новая',
  processing: 'В работе',
  completed: 'Выполнена',
  cancelled: 'Отменена'
};

export const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  processing: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};