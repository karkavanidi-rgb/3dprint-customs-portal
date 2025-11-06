import json
import os
import psycopg2
from typing import Dict, Any
from decimal import Decimal

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Получение и удаление заявок для админ-панели
    Args: event - dict с httpMethod, headers для авторизации
          context - объект с request_id и другими параметрами
    Returns: JSON список заявок или результат удаления
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    admin_token = headers.get('x-admin-token') or headers.get('X-Admin-Token')
    
    if not admin_token or admin_token != 'a8f3K9mP2xR7qL5nB4vC6wE1sH0jT3yU8zG2d':
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    if method == 'GET':
        cursor.execute('''
            SELECT 
                id, customer_type, company_name, inn, email, phone,
                length, width, height, plastic_type, color, infill,
                quantity, description, file_url, file_name, status,
                created_at, updated_at
            FROM orders
            ORDER BY created_at DESC
        ''')
        
        columns = [desc[0] for desc in cursor.description]
        orders = []
        
        for row in cursor.fetchall():
            order_dict = dict(zip(columns, row))
            if order_dict.get('created_at'):
                order_dict['created_at'] = order_dict['created_at'].isoformat()
            if order_dict.get('updated_at'):
                order_dict['updated_at'] = order_dict['updated_at'].isoformat()
            
            for key, value in order_dict.items():
                if isinstance(value, Decimal):
                    order_dict[key] = float(value)
            
            orders.append(order_dict)
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'orders': orders})
        }
    
    elif method == 'DELETE':
        body_data = json.loads(event.get('body', '{}'))
        order_id = body_data.get('order_id')
        
        if not order_id:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'order_id is required'})
            }
        
        cursor.execute('DELETE FROM orders WHERE id = %s RETURNING id', (order_id,))
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        if result:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
        else:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Order not found'})
            }
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'})
    }